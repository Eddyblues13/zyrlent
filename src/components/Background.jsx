import bgImage from '../assets/background.jpg'

export default function Background() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat blur-[12px]"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0A0B3D]/70 via-[#080a2e]/55 to-[#05082E]/75"
        aria-hidden
      />
    </>
  )
}
