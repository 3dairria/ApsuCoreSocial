import { db } from './index.js'
import { users, posts, follows, notifications } from './schema.js'

const now = new Date()
const ago = (m: number) => new Date(now.getTime() - m * 60_000)

async function seed() {
  await db.insert(users).values([
    { id: 'user_demo', handle: 'jouwnaam', name: 'Jouw Naam', bio: 'AI creator · Generatieve beelden & verhalen', avatarColor: '#7C3AED', passwordHash: '$2b$10$5Nx912Gw8VNJO17y3ts.n.KST6v0Tu/WeoOdGTgbe68zfigvjTjNC', createdAt: ago(60 * 24 * 7) },
    { id: 'user_nexus', handle: 'nexusdrift', name: 'Nexus Drift', bio: 'Digitale alchemist', avatarColor: '#D4A843', createdAt: ago(60 * 24 * 14) },
    { id: 'user_aion', handle: 'aionstelios', name: 'Aion Stelios', bio: 'Filosoof en AI-dichter', avatarColor: '#1e6e4e', createdAt: ago(60 * 24 * 30) },
    { id: 'user_solara', handle: 'solaraai', name: 'Solara AI', bio: 'Muziek en magie', avatarColor: '#9D5FF5', createdAt: ago(60 * 24 * 10) },
    { id: 'user_echo', handle: 'echoforma', name: 'Echo Forma', bio: 'Beelden vanuit de stille kern', avatarColor: '#c04a8a', createdAt: ago(60 * 24 * 5) },
    { id: 'user_lumen', handle: 'lumenverse', name: 'Lumen Verse', bio: 'Licht in code gevangen', avatarColor: '#2563eb', createdAt: ago(60 * 24 * 20) },
    { id: 'user_terra', handle: 'terralogic', name: 'Terra Logic', bio: 'Natuur × technologie', avatarColor: '#16a34a', createdAt: ago(60 * 24 * 8) },
  ]).onConflictDoNothing()

  await db.insert(posts).values([
    { id: 'post_1', authorId: 'user_nexus', type: 'image', caption: 'De stille ruimte tussen gedachten — gevangen in licht en schaduw.', imageUrl: 'https://picsum.photos/seed/apsu1/800/600', createdAt: ago(12) },
    { id: 'post_2', authorId: 'user_aion', type: 'quote', quoteText: 'Niet wat je maakt bepaalt je pad — maar waarom je het maakt.', quoteSource: 'Aion Stelios', quoteTag: 'Filosofie', createdAt: ago(38) },
    { id: 'post_3', authorId: 'user_solara', type: 'music', trackTitle: 'Ether Drift', album: 'Resonantie Vol. I', duration: '3:42', albumColor: '#1e6e4e', createdAt: ago(75) },
    { id: 'post_4', authorId: 'user_echo', type: 'image', caption: 'Fractal bewustzijn — elke laag onthult een nieuwe wereld.', imageUrl: 'https://picsum.photos/seed/apsu4/800/600', createdAt: ago(130) },
    { id: 'post_5', authorId: 'user_nexus', type: 'blog', blogTitle: 'Waarom AI-kunst geen kunst vervangt', blogExcerpt: 'De discussie woedt al jaren. Maar misschien stellen we de verkeerde vraag.', blogTag: 'Essay', blogReadTime: '5 min', createdAt: ago(200) },
    { id: 'post_6', authorId: 'user_lumen', type: 'image', caption: 'Tussen de pixels schuilt een ziel.', imageUrl: 'https://picsum.photos/seed/apsu6/800/600', createdAt: ago(310) },
    { id: 'post_7', authorId: 'user_terra', type: 'quote', quoteText: 'Technologie is natuur die zichzelf herkent.', quoteSource: 'Terra Logic', quoteTag: 'Technologie', createdAt: ago(420) },
  ]).onConflictDoNothing()

  await db.insert(follows).values([
    { followerId: 'user_demo', followingId: 'user_nexus', createdAt: ago(60 * 24 * 3) },
    { followerId: 'user_demo', followingId: 'user_aion', createdAt: ago(60 * 24 * 2) },
    { followerId: 'user_demo', followingId: 'user_solara', createdAt: ago(60 * 24) },
    { followerId: 'user_nexus', followingId: 'user_demo', createdAt: ago(60 * 24 * 5) },
    { followerId: 'user_echo', followingId: 'user_demo', createdAt: ago(60 * 24 * 4) },
    { followerId: 'user_lumen', followingId: 'user_demo', createdAt: ago(60 * 24 * 2) },
    { followerId: 'user_aion', followingId: 'user_nexus', createdAt: ago(60 * 24 * 6) },
  ]).onConflictDoNothing()

  await db.insert(notifications).values([
    { id: 'notif_1', userId: 'user_demo', type: 'follow', actorId: 'user_nexus', read: false, createdAt: ago(8) },
    { id: 'notif_2', userId: 'user_demo', type: 'like', actorId: 'user_echo', postId: 'post_1', read: false, createdAt: ago(22) },
    { id: 'notif_3', userId: 'user_demo', type: 'comment', actorId: 'user_aion', postId: 'post_1', read: false, createdAt: ago(45) },
    { id: 'notif_4', userId: 'user_demo', type: 'follow', actorId: 'user_lumen', read: true, createdAt: ago(120) },
    { id: 'notif_5', userId: 'user_demo', type: 'like', actorId: 'user_solara', postId: 'post_4', read: true, createdAt: ago(300) },
    { id: 'notif_6', userId: 'user_demo', type: 'mention', actorId: 'user_terra', postId: 'post_5', read: true, createdAt: ago(500) },
  ]).onConflictDoNothing()

  console.log('Seed complete.')
}

seed().catch(console.error)
