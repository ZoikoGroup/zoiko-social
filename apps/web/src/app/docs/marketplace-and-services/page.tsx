import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShoppingBag, Bookmark, CreditCard, Package, Send, Stethoscope, Star, Dna, ShieldCheck,
  RotateCcw, Scale,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, Strong, Callout, Steps, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Shop, Providers & Bookings' }

export default function MarketplaceAndServicesPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={ShoppingBag}
        eyebrow="Shop & Services"
        title="Shop, Providers & Bookings"
        lead="Buying pet products, finding and booking vets and pet-care providers, and matchmaking through Breeding Match."
      />

      <JumpLinks
        items={[
          { href: '#shopping', label: 'Shopping' },
          { href: '#checkout-and-orders', label: 'Checkout & orders' },
          { href: '#refunds-and-cancellations', label: 'Refunds & cancellations' },
          { href: '#selling-in-the-shop', label: 'Selling in the Shop' },
          { href: '#finding-a-provider', label: 'Finding a provider' },
          { href: '#booking-a-provider', label: 'Booking a provider' },
          { href: '#breeding-match', label: 'Breeding Match' },
        ]}
      />

      <H2 id="shopping">Shopping</H2>
      <P>
        The <Strong>Shop</Strong> is where vetted sellers list pet products — food, accessories, care
        items, and more. Browse listings, save items you’re considering, and message a seller directly
        if you have a question before buying.
      </P>
      <FeatureGrid
        items={[
          { icon: ShoppingBag, title: 'Browse listings', body: 'Search and filter products by category, price, and seller.' },
          { icon: Bookmark, title: 'Save for later', body: 'Save a listing to your saved items without committing to a purchase.' },
        ]}
      />

      <H2 id="checkout-and-orders">Checkout & orders</H2>
      <P>
        Checkout is handled securely through Stripe — ZoikoSocial never stores your raw card details.
        Once you place an order, you can track it from your order history.
      </P>
      <FeatureGrid
        items={[
          { icon: CreditCard, title: 'Secure checkout', body: 'Pay with a card through Stripe\'s secure checkout flow.' },
          { icon: Package, title: 'Order history', body: 'Buyers can review past orders; sellers can review everything they\'ve sold.' },
        ]}
      />

      <H2 id="refunds-and-cancellations">Refunds &amp; cancellations</H2>
      <P>
        If you start a checkout and don’t finish paying, the order is cancelled on its own and nothing
        is charged. Once an order has been paid for, its status keeps up with what happened to the
        money — so your order history stays accurate even when a payment is reversed after the fact.
      </P>
      <FeatureGrid
        items={[
          { icon: RotateCcw, title: 'Refunded', body: 'The payment was returned. A partial refund leaves the order open, since part of the payment still stands.' },
          { icon: Scale, title: 'Disputed', body: 'You raised a dispute with your bank or card issuer. The order stays in this state until the dispute is settled.' },
        ]}
      />
      <P>
        To ask for a refund, <Strong>message the seller first</Strong> — most issues are quickest to
        sort out directly. There’s no self-service refund button yet: refunds are issued by the seller
        or by our support team, and your order history updates once the payment has actually been
        returned, not when it’s requested.
      </P>
      <Callout variant="note" title="How you’ll hear about it">
        You’ll get an in-app notification when an order is refunded. We don’t send a refund email yet,
        so your order history is the place to check for the full details and the current status.
      </Callout>

      <H2 id="selling-in-the-shop">Selling in the Shop</H2>
      <P>
        Create a listing with photos, a description, and a price. Buyers can message you directly with
        questions through your seller inbox before they decide to buy.
      </P>
      <Callout variant="note">
        Listings go through the same profanity-free and safety review as every other piece of content —
        deceptive claims or prohibited items aren’t allowed, animal welfare products included.
      </Callout>
      <Callout variant="warning" title="If a sale is refunded or disputed">
        You’ll get an in-app notification when a sale is refunded, when a buyer disputes a payment,
        and when that dispute is settled. A refunded item is <Strong>not</Strong> put back on sale
        automatically — you may already have shipped it — so create a new listing if you want to sell
        it again.
      </Callout>

      <H2 id="finding-a-provider">Finding a provider</H2>
      <P>
        <Strong>Vet Finder</Strong> and <Strong>Pet Care</Strong> connect you with veterinarians, trainers,
        groomers, and sitters who’ve set up a professional profile on ZoikoSocial. Search by service
        type and location, and check their profile for their services, availability, and reviews from
        other pet owners.
      </P>
      <FeatureGrid
        items={[
          { icon: Stethoscope, title: 'Vet Finder', body: 'Search for veterinarians and clinics near you.' },
          { icon: Star, title: 'Reviews', body: 'Read reviews left by other pet owners before you book.' },
        ]}
      />
      <P>
        Providers reach this directory by completing{' '}
        <Link href="/docs/profile-and-pets#professional-verification" className="text-primary font-medium hover:underline">
          professional verification
        </Link>{' '}
        first, so you know you’re booking with a real, accountable business.
      </P>

      <H2 id="booking-a-provider">Booking a provider</H2>
      <Steps
        items={[
          { title: 'Check availability', body: 'View a provider\'s open time slots directly on their profile.' },
          { title: 'Request a booking', body: 'Choose a service and time, and send your booking request.' },
          { title: 'Track its status', body: 'Follow your booking as it moves from requested to confirmed.' },
          { title: 'Review the visit summary', body: 'After the appointment, the provider can share a visit summary — useful for keeping your pet\'s Health Passport up to date.' },
        ]}
      />

      <H2 id="breeding-match">Breeding Match</H2>
      <P>
        Breeding Match is ZoikoSocial’s ethical matchmaking tool for verified breeders — built around
        health-record transparency rather than casual pairing.
      </P>
      <FeatureGrid
        items={[
          { icon: ShieldCheck, title: 'Verified breeding profiles', body: 'Breeders complete a verification step before their profile becomes discoverable.' },
          { icon: Dna, title: 'Litters', body: 'Track and share information about upcoming or past litters.' },
          { icon: Send, title: 'Match requests', body: 'Send or receive a match request, with dedicated messaging to work out details.' },
          { icon: Star, title: 'Reviews & alerts', body: 'Reviews from other breeders build a track record over time, and alerts notify you when a fitting match appears.' },
        ]}
      />

      <DocsFooterNav currentSlug="marketplace-and-services" />
    </>
  )
}
