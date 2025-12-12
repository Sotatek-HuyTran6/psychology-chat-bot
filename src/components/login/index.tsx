import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { LoginForm } from "../LoginForm";

export const LoginPage = () => {
  return (
    <div className="h-dvh overflow-y-auto">
      <div className="bg-[#3b142a] min-h-dvh h-auto">
        <div className="max-w-[1280px] mx-auto py-8 px-8 max-sm:px-4">
          <Link to="/">
            <div className='font-bold text-[18px] whitespace-nowrap text-[#e8589d] flex gap-2 items-center'>
              <div className='!max-w-[45px]'>
                <img
                  src="./images/logo/wayground.png"
                  alt="Logo"
                />
              </div>
                Plays
            </div>
          </Link>

          <div className="mt-20 flex gap-8 max-lg:flex-col max-lg:mt-10">
            <div className="text-[#f3efda] flex-1">
              <h2 className="text-[44px] max-md:text-[32px] max-sm:text-[24px] font-semibold">
                Hành trình chăm sóc tâm hồn của bạn bắt đầu từ đây
              </h2>
              <p className="text-[17px] max-md:text-[15px] max-sm:text-[14px] leading-relaxed mt-4 max-lg:hidden">
                Chúng tôi hiểu rằng mỗi người đều có những khó khăn riêng trong cuộc sống. 
                Đó là lý do tại sao chúng tôi tạo ra một không gian an toàn, nơi bạn có thể 
                chia sẻ, học hỏi và phát triển bản thân một cách tự nhiên nhất.
              </p>
              <div className="flex gap-3 items-start mt-8 max-md:mt-6 text-[14px] max-md:text-[13px] max-sm:text-[12px]">
                <div className="text-[#e8589d] mt-1 text-[14px] max-md:text-[12px]">
                  <FaCheck />
                </div>
                <p className="leading-relaxed">
                  <span className="font-semibold text-[#e8589d]">Trí tuệ nhân tạo thấu hiểu</span> - 
                  Gemini AI được huấn luyện đặc biệt để lắng nghe và đồng hành cùng bạn 
                  trong mọi khoảnh khắc khó khăn, mang đến lời khuyên chân thành và phù hợp.
                </p>
              </div>
              <div className="flex gap-3 items-start mt-6 max-md:mt-4 text-[14px] max-md:text-[13px] max-sm:text-[12px]">
                <div className="text-[#e8589d] mt-1 text-[14px] max-md:text-[12px]">
                  <FaCheck />
                </div>
                <p className="leading-relaxed">
                  <span className="font-semibold text-[#e8589d]">Hành trình cá nhân hóa</span> - 
                  Từ việc đánh giá tâm lý đến lập kế hoạch phát triển bản thân, 
                  mỗi bước đi đều được thiết kế riêng cho con người độc nhất vô nhị của bạn.
                </p>
              </div>
              <div className="flex gap-3 items-start mt-6 max-md:mt-4 text-[14px] max-md:text-[13px] max-sm:text-[12px]">
                <div className="text-[#e8589d] mt-1 text-[14px] max-md:text-[12px]">
                  <FaCheck />
                </div>
                <p className="leading-relaxed">
                  <span className="font-semibold text-[#e8589d]">Sự đồng hành bền vững</span> - 
                  Không chỉ là lời tư vấn nhất thời, chúng tôi theo dõi hành trình của bạn, 
                  giúp bạn ghi nhận tiến bộ và điều chỉnh phương hướng khi cần thiết.
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-[#f3efda] p-6 rounded-lg">
                <LoginForm setIsLoginModalOpen={() => null} setIsSignupModalOpen={() => null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}