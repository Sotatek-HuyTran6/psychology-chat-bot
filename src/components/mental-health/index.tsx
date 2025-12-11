import { MentalHealth } from "./MentalHealth"

export const MentalHealthPage = () => {
  return (
    <div className='overflow-y-auto h-[calc(100vh-64px)] bg-[#f3efda]'>
      <div className="max-w-4xl w-full mx-auto p-6">
        <MentalHealth open={true} onClose={() => null} />
      </div>
    </div>
  )
}