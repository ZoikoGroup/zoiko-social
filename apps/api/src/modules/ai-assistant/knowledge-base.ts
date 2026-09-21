/**
 * Knowledge base for ZoikoSocial AI.
 *
 * Hand-authored from the platform docs under `apps/web/src/app/docs/**`, which are
 * written as JSX components rather than markdown — there is no machine-readable
 * source to derive this from, so entries are maintained here by hand. When a docs
 * page changes materially, update the matching entry below.
 *
 * `keywords` drive retrieval (see `retrieve.ts`); `content` is injected verbatim
 * into the model's context, so keep each entry short, factual, and self-contained.
 */

export interface KnowledgeEntry {
  topic: string
  keywords: string[]
  content: string
  docsPath: string
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    topic: 'What ZoikoSocial is',
    keywords: ['zoikosocial', 'zoiko', 'platform', 'what is this', 'about', 'purpose', 'mission'],
    content:
      'ZoikoSocial is a social platform built for animal lovers, rescuers, veterinarians, breeders, and anyone who cares about animal welfare, the environment, science and technology. It has the features you would expect from a modern social app — a feed, communities, messaging, video calls and marketplaces — but everything runs under one set of safety-first rules. Four principles hold everywhere: it is profanity-free by design, animal welfare comes before engagement, news must be verified and well-sourced, and every safety-relevant action is logged and auditable.',
    docsPath: '/docs/getting-started',
  },
  {
    topic: 'Creating an account and signing in',
    keywords: ['sign up', 'signup', 'register', 'create account', 'log in', 'login', 'sign in', 'password', 'forgot password', 'reset password', 'google', 'apple', 'facebook', 'username', 'verify email', 'email verification', 'confirmation link'],
    content:
      'You can sign up with an email and password, or with Google, Apple or Facebook in one tap. Email signups confirm their address with a verification link we send — if it has not arrived, check spam and request a new one from the sign-in page. You then pick a username, which is how people find and @mention you — like everything else on ZoikoSocial it must pass the profanity-free check. If you forget your password, use the "Forgot password" link on the sign-in page to reset it by email.',
    docsPath: '/docs/getting-started#creating-your-account',
  },
  {
    topic: 'Setting up your profile',
    keywords: ['profile', 'display name', 'bio', 'avatar', 'profile photo', 'edit profile', 'handle', 'privacy level'],
    content:
      'Your profile is your human identity on the platform, separate from any pet profiles you create. From Profile (or Settings → Account) you can set your display name, your unique @username (checked for availability as you type), a bio and avatar, and your privacy level. If you are a veterinarian, trainer, groomer, sitter, breeder, or run a pet-related business, you can also switch on a professional profile.',
    docsPath: '/docs/profile-and-pets#setting-up-your-profile',
  },
  {
    topic: 'Account verification — how to get verified',
    keywords: [
      'verification', 'verify', 'verified', 'get verified', 'verify my account', 'verify account', 'blue tick', 'badge', 'verified badge',
      'identity verification', 'organisation', 'organization', 'rescue account', 'shelter account', 'charity', 'clinic account',
      'verification request', 'verification documents', 'documents', 'photo id', 'business licence', 'license', 'proof of address',
      'verification status', 'under review', 'awaiting review', 'rejected', 'apply again', 'resubmit',
    ],
    // Written from the real flow in Settings → Verification (VerificationSettings.tsx):
    // three request types, document uploads, and a status lifecycle. An earlier,
    // vaguer entry made the model invent steps or dodge the question entirely.
    content:
      'Verification is applied for from Settings → Verification. Pick one of three request types: Professional (vet, groomer, trainer, seller or publisher — you also pick your professional category), Identity (confirms you are who your profile says you are), or Organisation (for a rescue, shelter, charity or clinic). Add an optional note for the reviewer — clinic name, registration number, years practising — then submit. Next, attach supporting documents: photo ID, business licence, professional registration, proof of address, or another supporting document. Files can be JPG, PNG, WebP or PDF, up to 10 MB, and are stored privately — only you and the reviewer can open them. You can keep adding documents while the request is open. Your request then moves from Awaiting review to Under review, and ends Approved or Not approved; you are notified either way, and a rejection states the reason and is not a dead end — you can apply again. Once approved, the badge shows on your profile, posts and messages. Email confirmation is separate from verification: confirming your email happens at signup, while the verification badge comes from this review. What reviewers check and turnaround times are internal to the team, so for the general policy see the docs page below.',
    docsPath: '/docs/profile-and-pets#professional-verification',
  },
  {
    topic: 'Professional profiles and what they unlock',
    keywords: ['professional', 'switch to professional', 'go professional', 'professional profile', 'professional category', 'business account', 'business name', 'dashboard', 'analytics', 'revert to personal'],
    content:
      'From your profile you can switch on a professional profile and choose one of four categories: Veterinarian, Pet Care Service Provider (grooming, boarding, training, sitting), Product Seller, or Verified News Publisher. You add a business name and description, and it can be switched back off at any time — your posts, followers and messages stay either way. Going professional is the doorway to verification (Settings → Verification), provider search, the seller dashboard, post analytics and news publishing.',
    docsPath: '/docs/profile-and-pets#professional-verification',
  },
  {
    topic: 'Pet profiles and Pet Diary',
    // Deliberately no bare 'my pet' / 'pet' here: it appears in nearly every
    // question on this platform and would outrank the topic actually being asked
    // about (e.g. "I lost my pet" belongs to Lost and Found, not to Pet Diary).
    keywords: ['pet profile', 'add a pet', 'add pet', 'pet diary', 'milestone', 'weight check', 'diary'],
    content:
      'Pet profiles are the heart of ZoikoSocial. Go to Pet Diary or your Profile and choose "Add a pet" — name, species, breed and a photo are enough to start, and you can fill in the rest over time. The Pet Diary logs milestones like a first walk, a birthday or a weight check-in, with photos and videos attached, and whole entries — or the whole diary — can be shared with family, a sitter or a co-owner. Each pet profile can be set public or private independently of your own profile. You can also just ask me to add a pet or log something and I will do it for you.',
    docsPath: '/docs/profile-and-pets#pet-diary',
  },
  {
    topic: 'Health Passport — records, reminders and weight',
    keywords: ['health passport', 'health record', 'medical record', 'vaccination', 'vaccine', 'vet visit', 'medication', 'allergy', 'weight', 'log weight', 'weight chart', 'reminder', 'reminders', 'next due', 'calendar', 'ics'],
    // Exact steps matter here: with only a description of the feature, the model
    // invented a plausible flow (pick your vet from a list, enter their email,
    // press Send). None of that exists — it is a QR code and a copyable link.
    content:
      "The Health Passport is a pet's medical record, kept separate from the casual Pet Diary so health details stay easy to find in an emergency. It holds six record types: vaccinations (with vaccine name templates like Rabies, DHPP or FVRCP), vet visits, medications, allergies, weight entries and freeform notes — each with a title, date and notes. Vaccinations carry a next-due date, the passport shows what is overdue and coming up across your pets, and the reminders can be downloaded as a calendar (.ics) file. The Weight view draws a weight chart from the weight entries, which you can log right there. Records can be filtered by type. Health records are private by default — only you, and anyone you explicitly share with, can see them.",
    docsPath: '/docs/profile-and-pets#health-passport',
  },
  {
    topic: 'Sharing health records — vet card and public Pet Passport link',
    keywords: ['share records', 'share health', 'share passport', 'records', 'records with', 'vet card', 'share vet card', 'qr', 'qr code', 'pet passport', 'public link', 'boarding', 'groomer access', 'travel', 'revoke'],
    content:
      "There are two ways to share a pet's records, both read-only and scoped. The vet card: open Health Passport, pick the pet, and use the share icon in the pet's header — it opens \"Share vet card\", which creates a QR code plus a link. Show the QR at the clinic or send the link; whoever opens it gets a read-only medical card for that one pet, with no access to your other pets or your profile. There is no vet directory, email field or send button involved — it is just the QR and the link. Revoke access from the same Share vet card panel at any time, which instantly kills the old link. The public Pet Passport link: a simple shareable page with the essentials — name, photo and whichever details you choose to include — designed for someone who needs to quickly verify your pet's identity or vaccination status without an account, like a boarding facility or a travel check. You control exactly what appears on it; anything you do not choose to share never shows up.",
    docsPath: '/docs/profile-and-pets#pet-passport-lookup',
  },
  {
    topic: "A pet's About details — age, colour, microchip, neutered status",
    keywords: [
      'about', 'age', 'date of birth', 'birthday', 'birthdate', 'how old', 'colour', 'color', 'markings',
      'microchip', 'chip number', 'neutered', 'spayed', 'adoption date', 'gotcha day', 'edit pet', 'pet details',
    ],
    content:
      "Pet Diary and Health Passport are both reached from the More menu in the top navigation on desktop, or the + tray on mobile. Each pet has an About panel on Pet Diary and Health Passport showing their age, colour and markings, latest logged weight, whether they are neutered or spayed, when they were adopted, and their microchip number. Use the Edit link on that panel to change any of it. Age comes from the date of birth, so setting a date of birth is what makes the age appear — it also gives you a birthday reminder under \"Coming up\". Weight is not typed in here: it comes from the weight entries logged in Pet Diary or Health Passport, so the About panel always shows the most recent one. The microchip number is only visible to you and to anyone holding a vet card link you have shared. You can also just ask me to change any of these and I will do it for you.",
    docsPath: '/docs/profile-and-pets',
  },
  {
    topic: 'Feed and posts',
    keywords: ['feed', 'home feed', 'explore', 'post', 'posting', 'create post', 'caption', 'photo', 'video', 'like', 'comment', 'save', 'reaction', 'caught up', 'back to top', 'new posts'],
    content:
      'The Home feed shows posts from people and communities you follow; Explore surfaces public posts you do not already follow. Tap compose to create a post: write text, attach photos or video, tag a pet profile so it appears on their page too, add hashtags, and choose who can see it. Posts support reactions, comments and saves. When new posts arrive while you are reading, a "New posts" pill appears; the end of the feed tells you plainly that you are all caught up with a button to refresh, and a round arrow button appears once you have scrolled down to take you back to the top.',
    docsPath: '/docs/feed-and-content#home-feed-and-explore',
  },
  {
    topic: 'Hashtags and trends',
    keywords: ['hashtag', 'hashtags', 'trend', 'trending', 'tag', 'search posts', 'discover'],
    content:
      'Hashtags group posts by topic so people searching those topics can find your content. Trending hashtags surface what the community is talking about right now. You can also use the search bar at the top of the app to search across people, hashtags, posts, communities, news and shop products all at once.',
    docsPath: '/docs/feed-and-content#hashtags-and-trends',
  },
  {
    topic: 'Network, following and connections',
    keywords: ['follow', 'unfollow', 'follower', 'following', 'network', 'connections', 'mutual', 'suggestions', 'people you may know', 'follow request'],
    content:
      'The Network section shows your followers, who you follow, mutual connections and suggested people. If your profile is private, new followers arrive as follow requests you approve or decline. You can also block or mute anyone — blocking cuts off contact both ways, while muting quietly removes someone from your feed without them knowing.',
    docsPath: '/docs/community-and-events#following-and-connections',
  },
  {
    topic: 'Communities',
    keywords: ['community', 'communities', 'group', 'join community', 'create community', 'moderator', 'rules', 'members', 'invite', 'community chat'],
    content:
      'Communities are species-based, local, rescue or interest groups. They can be public, private or invite-only. Each has its own feed, its own chat, rules that members accept on joining, and clear accountability through roles — owners, moderators and members — with a visible moderation log. You can browse and search communities, or create your own.',
    docsPath: '/docs/community-and-events#communities',
  },
  {
    topic: 'Events',
    keywords: ['event', 'events', 'rsvp', 'meetup', 'workshop', 'birthday', 'adoption drive', 'attend'],
    content:
      'Events cover pet birthdays, adoption drives, training workshops, fundraisers and meetups. You can browse events near you, RSVP, see who else is attending, and host your own. Events are treated as a core part of the platform rather than an afterthought, so they have invitations, their own chat and attendee lists.',
    docsPath: '/docs/community-and-events#events',
  },
  {
    topic: 'Messaging',
    keywords: ['message', 'messages', 'messaging', 'dm', 'direct message', 'chat', 'group chat', 'message request', 'read receipt', 'inbox', 'theme'],
    content:
      'From Messages you can start a one-to-one conversation with anyone you follow or who follows you, or create a group chat. If someone who does not follow you messages you, it arrives as a message request you can review, accept or decline, keeping your main inbox for people you actually know. Messages support emoji reactions, read receipts, in-conversation search, and per-conversation color themes. Every message is checked against the profanity-free standard before it is delivered, and attachments are screened.',
    docsPath: '/docs/messaging-and-calls#starting-a-conversation',
  },
  {
    topic: 'Polls, attachments, forwarding and location in chat',
    keywords: ['poll', 'polls', 'vote', 'attachment', 'send photo', 'voice note', 'voice message', 'document', 'forward', 'location', 'share location', 'reply to message'],
    content:
      'In any conversation you can post a poll with a set of options — everyone sees results update as people vote. You can send photos, videos, voice notes and documents as attachments (videos are capped at five minutes), and share your location, which is handy when arranging to meet about a rescue, adoption or sale. Anything sent can be forwarded to another conversation, and you can reply to a specific message — tapping the quoted reply jumps back to the original and highlights it.',
    docsPath: '/docs/messaging-and-calls#polls-and-attachments',
  },
  {
    topic: 'Audio and video calls',
    keywords: ['call', 'calls', 'video call', 'audio call', 'voice call', 'ring', 'recording', 'consent'],
    content:
      'Calls run directly in your browser with nothing to download. You can start an audio or video call from any conversation, one-to-one or with a group. Nobody can record a call without every participant explicitly agreeing first — there is no way to record silently in the background.',
    docsPath: '/docs/messaging-and-calls#audio-and-video-calls',
  },
  {
    topic: 'Adoption and rescue',
    keywords: ['adopt', 'adoption', 'rescue', 'rehome', 'shelter', 'apply to adopt', 'listing', 'foster'],
    content:
      'You can browse adoption listings filtered by species and location, including a "near me" option, and apply to adopt through the listing. If you need to rehome a pet, you can create a listing yourself — clear, honest details about the pet and their history are what reviewers and adopters look for. Adoption is treated as a high-trust area: listings and enquiries are reviewed with animal welfare and anti-trafficking safeguards ahead of convenience.',
    docsPath: '/docs/adoption-and-lost-found#applying-to-adopt',
  },
  {
    topic: 'Lost and Found pets',
    keywords: ['lost', 'found', 'lost pet', 'missing', 'missing pet', 'sighting', 'reward', 'found a pet', 'stray'],
    content:
      'Lost & Found lets you report a lost pet with photos, a last-seen location and an optional reward, or report a pet you have found. Others can submit sightings on your report, and the platform surfaces potential matches between lost and found reports so you can review them.',
    docsPath: '/docs/adoption-and-lost-found#reporting-a-lost-pet',
  },
  {
    topic: 'Shop and marketplace',
    keywords: ['shop', 'buy', 'sell', 'product', 'marketplace', 'order', 'checkout', 'payment', 'seller', 'price', 'listing'],
    content:
      'The Shop carries pet products — food, toys, health items, grooming supplies, beds and accessories — from vetted sellers. You can browse by category, save products, and enquire with a seller before buying. Checkout runs through a secure hosted payment page, and your orders are tracked in your order history — buyers see what they have bought, sellers see everything they have sold. If you sell, you can list products and manage enquiries and orders from your dashboard.',
    docsPath: '/docs/marketplace-and-services#checkout-and-orders',
  },
  {
    topic: 'Order problems — refunds, cancellations and disputes',
    keywords: ['refund', 'refunded', 'cancel', 'cancelled order', 'cancellation', 'dispute', 'disputed', 'chargeback', 'money back', 'payment failed', 'abandoned checkout'],
    content:
      'If you start a checkout and do not finish paying, the order cancels on its own and nothing is charged. Once an order is paid for, its status keeps up with what happened to the money: Refunded means the payment was returned — a partial refund leaves the order open, since part of the payment still stands — and Disputed means you raised a dispute with your bank or card issuer, and the order stays in that state until the dispute is settled. Your order history is the place to check the full details and current status.',
    docsPath: '/docs/marketplace-and-services#refunds-and-cancellations',
  },
  {
    topic: 'Pet care providers, vets and bookings',
    keywords: ['vet', 'vet finder', 'find a vet', 'provider', 'pet care', 'walker', 'sitter', 'groomer', 'boarding', 'book', 'booking', 'appointment', 'consultation'],
    content:
      'Vet Finder and Pet Care let you search verified veterinarians and pet-care providers — walkers, sitters, groomers, boarding — filtered by service and location, with reviews from other users. You can view a provider’s availability and book an appointment directly, including video consultations with some vets.',
    docsPath: '/docs/marketplace-and-services#booking-a-provider',
  },
  {
    topic: 'Breeding Match',
    keywords: ['breeding', 'breed match', 'breeding match', 'litter', 'dna', 'stud', 'mate', 'pedigree'],
    content:
      'Breeding Match connects owners for ethical breeding, built around health verification rather than looks. Listings can carry verified health records and DNA results, and the matching surface warns about health risks it detects. Litters can be tracked, and breeders can be reviewed by others.',
    docsPath: '/docs/marketplace-and-services#breeding-match',
  },
  {
    topic: 'Verified News',
    keywords: ['news', 'article', 'publisher', 'source', 'verified news', 'read news', 'tier'],
    content:
      'The News section carries animal, environment, climate, science and technology stories. Every article shows its source and a tier — institutional publisher, verified professional, or community contributor — so you can weigh it accordingly. You can like, save and comment on articles. News is deliberately handled differently from ordinary posts: it is source-tiered, reviewed and correctable rather than treated as just another post.',
    docsPath: '/docs/news#where-articles-come-from',
  },
  {
    topic: 'Notifications and push',
    keywords: ['notification', 'notifications', 'alert', 'alerts', 'push', 'push notification', 'browser permission', 'unread', 'mute notifications', 'email notification'],
    content:
      'The Notification Center collects likes, comments, follows, messages, invitations and more, with an unread badge in the top bar. Which notifications you receive per category is controlled from Settings → Notifications. Push notifications reach you even when ZoikoSocial is closed, but they are off until you turn them on — your browser asks for permission the first time, and nothing is sent before you allow it. The Push Notifications switch is the master switch: turning it off silences every push regardless of category.',
    docsPath: '/docs/notifications-and-settings#push-notifications',
  },
  {
    topic: 'Account settings, security and deleting your account',
    keywords: ['settings', 'preferences', 'security', 'change password', 'change email', 'active sessions', 'sign out', 'log out', 'sessions', 'delete account', 'currency', 'display'],
    content:
      'Settings has eight sections: Account, Privacy, Blocked accounts, Verification, Security, Notifications, Preferences and Help. Security is where login controls live: change your password (it asks for your current password first), change your email (also re-asks for your password), and review active sessions — the devices currently signed in to your account — signing out any you do not recognise. Preferences cover display choices like currency. Deleting your account is also done from Settings.',
    docsPath: '/docs/notifications-and-settings#security',
  },
  {
    topic: 'The ZoikoSocial AI assistant itself',
    keywords: ['assistant', 'ai', 'ai assistant', 'zoikosocial ai', 'what can you do', 'help me', 'who are you'],
    content:
      'I am ZoikoSocial AI, the assistant every member has a private chat with in Messages. I can explain how any part of the platform works — accounts, verification, pets, the feed, communities, events, messaging, calls, adoption, lost and found, the shop, news and settings — answer questions about animal care, and actually do things for you: add or edit your own pets, log a weight, and search real vets and pet-care providers, adoption listings, events and lost-and-found reports, sending you the links. I am not a veterinarian and I do not give diagnoses — for anything urgent I will tell you to get to a vet straight away. I cannot delete anything or change your profile, privacy or settings; for those I will point you to the right screen.',
    docsPath: '/docs/messaging-and-calls#the-ai-assistant',
  },
  {
    topic: 'Safety, reporting and moderation',
    keywords: ['report', 'reporting', 'safety', 'moderation', 'block', 'mute', 'profanity', 'abuse', 'harassment', 'appeal', 'suspended', 'banned', 'restriction', 'animal welfare', 'cruelty'],
    content:
      'ZoikoSocial is profanity-free everywhere: posts, comments, direct messages, usernames, community names and event titles are all checked before they are stored. Animal welfare content that puts an animal at risk is never allowed to outrank safety, and cruelty or trafficking signals are escalated with priority. You can report any post, comment, message, account, community or listing; reports go to a moderation queue and every decision is logged and auditable. You can block or mute anyone. If your account is restricted you are told why and can appeal.',
    docsPath: '/docs/safety-and-trust#reporting',
  },
  {
    topic: 'Privacy and your data',
    keywords: ['privacy', 'private account', 'who can see', 'data', 'my data', 'visibility', 'private', 'gdpr', 'export'],
    content:
      'You control your visibility from Settings → Privacy: whether your profile is private, who can message you, who can see your activity, and the visibility of each pet profile separately. Health records are only shared when you explicitly grant access, per pet, and can be revoked. Sensitive metadata is stripped from uploaded photos, and you can delete your account from Settings.',
    docsPath: '/docs/safety-and-trust#your-data',
  },
]
