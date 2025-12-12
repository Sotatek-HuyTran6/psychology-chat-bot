import { MentalHealth } from "./MentalHealth"

export const MentalHealthPage = () => {
  return (
    <div>
      <div className="max-w-4xl w-full mx-auto p-6">
        <MentalHealth open={true} onClose={() => null} />
      </div>
    </div>
  )
}