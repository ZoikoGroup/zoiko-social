import fs from 'node:fs'
import path from 'node:path'

const appDir = path.resolve('apps/web/src/app')
const srcDir = path.resolve('apps/web/src')

// 1. Collect all defined routes in Next.js App Router
function getRoutes(dir, baseRoute = '') {
  let routes = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const name = entry.name
      // Route groups like (auth) or (legal) do not add to the URL path
      if (name.startsWith('(') && name.endsWith(')')) {
        routes = routes.concat(getRoutes(path.join(dir, name), baseRoute))
      } else {
        const nextRoute = `${baseRoute}/${name}`
        routes = routes.concat(getRoutes(path.join(dir, name), nextRoute))
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.js') {
      routes.push(baseRoute === '' ? '/' : baseRoute)
    }
  }
  return routes
}

const definedRoutes = getRoutes(appDir)
console.log(`Found ${definedRoutes.length} defined routes in apps/web:`)
definedRoutes.sort().forEach((r) => console.log('  ', r))

// Convert defined routes into regexes to match dynamic parameters
const routePatterns = definedRoutes.map((r) => {
  // Replace [param] with ([^/]+)
  // Replace [...param] with (.+)
  const regexStr = '^' + r
    .replace(/\[\.\.\.[^\]]+\]/g, '(.+)')
    .replace(/\[[^\]]+\]/g, '([^/]+)') + '$'
  return { route: r, regex: new RegExp(regexStr) }
})

// Match function
function isValidRoute(urlPath) {
  // Strip query string and hash
  const cleanPath = urlPath.split('?')[0].split('#')[0]
  if (!cleanPath || cleanPath === '/') return true
  // Normalize trailing slash
  const normalized = cleanPath.length > 1 && cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath

  // Also check static files in public
  if (fs.existsSync(path.resolve('apps/web/public', normalized.slice(1)))) {
    return true
  }

  return routePatterns.some((p) => p.regex.test(normalized))
}

// 2. Scan all files in apps/web/src for internal links
function scanLinks(dir) {
  let broken = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      broken = broken.concat(scanLinks(fullPath))
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      // match href="..." or href={`...`}
      const hrefRegex = /href=["'](\/[^"'#?]*)(\?[^"']*)?(#[^"']*)?["']/g
      let match
      while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1]
        // skip external or special links
        if (link.startsWith('//') || link.startsWith('/api/')) continue

        if (!isValidRoute(link)) {
          broken.push({
            file: path.relative(process.cwd(), fullPath),
            link,
            fullMatch: match[0]
          })
        }
      }

      // match template literals: href={`/something/...`}
      const templateRegex = /href=\{`(\/[^`$]*)\$\{/g
      while ((match = templateRegex.exec(content)) !== null) {
        const rawPrefix = match[1]
        const prefix = rawPrefix.split('?')[0]
        // See if any defined route starts with this prefix
        const prefixValid = routePatterns.some((p) => p.route.startsWith(prefix) || p.regex.test(prefix))
        if (!prefixValid && prefix !== '/') {
          broken.push({
            file: path.relative(process.cwd(), fullPath),
            link: `${rawPrefix}\${...}`,
            fullMatch: match[0]
          })
        }
      }
    }
  }
  return broken
}

console.log('\nScanning apps/web/src for internal links...')
const brokenLinks = scanLinks(srcDir)

if (brokenLinks.length === 0) {
  console.log('✓ All internal links match valid routes! No 404 links found.')
} else {
  console.log(`Found ${brokenLinks.length} potentially broken links:`)
  brokenLinks.forEach((b) => {
    console.log(`  ${b.file}: link "${b.link}"`)
  })
}
