import { SearchController } from './search.controller'
import type { SearchService } from './search.service'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const USER = { id: 'user-1' } as AuthenticatedUser

function buildController() {
  const searchService = {
    searchAll: jest.fn().mockResolvedValue({}),
    searchPeople: jest.fn().mockResolvedValue([]),
    searchHashtags: jest.fn().mockResolvedValue([]),
    searchPosts: jest.fn().mockResolvedValue([]),
    searchCommunities: jest.fn().mockResolvedValue([]),
    searchNews: jest.fn().mockResolvedValue([]),
    searchProducts: jest.fn().mockResolvedValue([]),
  }
  const controller = new SearchController(searchService as unknown as SearchService)
  return { controller, searchService }
}

describe('SearchController', () => {
  it('all() wraps the combined result in { data } and defaults an absent query to an empty string', async () => {
    const { controller, searchService } = buildController()
    searchService.searchAll.mockResolvedValue({ query: '', people: [] })

    const response = await controller.all(undefined, USER)

    expect(searchService.searchAll).toHaveBeenCalledWith('user-1', '')
    expect(response).toEqual({ data: { query: '', people: [] } })
  })

  it('all() passes an undefined viewer id through for an anonymous-shaped user', async () => {
    const { controller, searchService } = buildController()
    await controller.all('dane', undefined)
    expect(searchService.searchAll).toHaveBeenCalledWith(undefined, 'dane')
  })

  it('people() defaults the limit to 20 when absent', async () => {
    const { controller, searchService } = buildController()
    await controller.people('dane', undefined, USER)
    expect(searchService.searchPeople).toHaveBeenCalledWith('user-1', 'dane', 20)
  })

  it('people() parses a provided limit', async () => {
    const { controller, searchService } = buildController()
    await controller.people('dane', '5', USER)
    expect(searchService.searchPeople).toHaveBeenCalledWith('user-1', 'dane', 5)
  })

  it('people() falls back to 20 for a non-numeric limit', async () => {
    const { controller, searchService } = buildController()
    await controller.people('dane', 'not-a-number', USER)
    expect(searchService.searchPeople).toHaveBeenCalledWith('user-1', 'dane', 20)
  })

  it('people() falls back to 20 for a zero or negative limit', async () => {
    const { controller, searchService } = buildController()
    await controller.people('dane', '0', USER)
    expect(searchService.searchPeople).toHaveBeenCalledWith('user-1', 'dane', 20)
  })

  it('hashtags() does not require a viewer', async () => {
    const { controller, searchService } = buildController()
    await controller.hashtags('dane', '10')
    expect(searchService.searchHashtags).toHaveBeenCalledWith('dane', 10)
  })

  it('posts()/communities()/news()/products() each delegate with the parsed limit and viewer id', async () => {
    const { controller, searchService } = buildController()

    await controller.posts('dane', '15', USER)
    expect(searchService.searchPosts).toHaveBeenCalledWith('user-1', 'dane', 15)

    await controller.communities('dane', '15', USER)
    expect(searchService.searchCommunities).toHaveBeenCalledWith('user-1', 'dane', 15)

    await controller.news('dane', '15', USER)
    expect(searchService.searchNews).toHaveBeenCalledWith('user-1', 'dane', 15)

    await controller.products('dane', '15', USER)
    expect(searchService.searchProducts).toHaveBeenCalledWith('user-1', 'dane', 15)
  })
})
