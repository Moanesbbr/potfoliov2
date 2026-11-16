import { heroWords, profile } from './data'
import { Nav } from './components/Nav'
import { PillLink, Stage, StackedTitle } from './components/Stage'
import { Channels, Footer, Help, Lab, LiveStrip, Path, Products, Stack, Ticker, WorkedWith } from './components/Sections'

const ORANGE = '#EC612C'
const NAVY = '#0C1A3D'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Stage
          id="top"
          animate
          bg={ORANGE}
          panel={NAVY}
          glow="radial-gradient(ellipse 38% 46% at 50% 66%, rgba(255,214,170,0.5), rgba(255,170,110,0.15) 55%, transparent 75%), radial-gradient(ellipse 120% 60% at 50% 125%, rgba(90,24,0,0.35), transparent 60%)"
          title={<StackedTitle text={profile.short} label={`${profile.name}, software engineer and founder of Tunispare`} size="clamp(3.6rem, 18.5vw, 19rem)" colors={[NAVY, '#8FD3F4', '#9CF07A']} drop />}
          avatar="/img/moanes-ben-brahim-3d-avatar.webp"
          avatarAlt="Moanes Ben Brahim, software engineer and founder of Tunispare, as a 3D avatar"
          words={heroWords}
          bottomLeft={
            <p>
              {profile.bio} <strong className="font-bold">{profile.availability}</strong>
            </p>
          }
          bottomRight={
            <>
              <PillLink href="#products" variant="solid">See the products</PillLink>
              <PillLink href="#help" variant="outline">Hire me</PillLink>
            </>
          }
        />
        <Ticker />
        <Products />
        <LiveStrip />
        <Lab />
        <Help />
        <WorkedWith />
        <Path />
        <Stack />
        <Channels />
        <Stage
          id="contact"
          bg={NAVY}
          panel="#081230"
          glow="radial-gradient(ellipse 36% 46% at 50% 70%, rgba(236,97,44,0.35), transparent 70%)"
          title={<StackedTitle as="h2" text="Let’s build" size="clamp(2.6rem, 12vw, 12rem)" colors={[ORANGE, '#8FD3F4', '#9CF07A']} />}
          avatar="/img/moanes-ben-brahim-avatar-hoodie.webp"
          avatarAlt="Moanes Ben Brahim 3D avatar in an orange hoodie with headphones"
          bottomLeft={<p>Tell me what you are building and where it is stuck.</p>}
          bottomRight={
            <>
              <PillLink href={profile.links.calendly} variant="solid">Schedule a call</PillLink>
              <PillLink href={`mailto:${profile.email}`} variant="outline">Email me</PillLink>
            </>
          }
        />
      </main>
      <Footer />
    </>
  )
}
