import { FaPinterest } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import RippleButton from "../common/RippleButton";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

const functions = [
    {
      title: 'AI Counseling Chat',
      description: 'Tư vấn tâm lý thông minh với Gemini AI',
      icon: '🤖',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Mental Health Assessment',
      description: 'Đánh giá sức khỏe tâm lý toàn diện bằng AI',
      icon: '🧠',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Psychological Testing Suite',
      description: 'Bộ bài kiểm tra tâm lý chuyên nghiệp',
      icon: '📊',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Smart Therapy Scheduler',
      description: 'Lập lịch trình điều trị thông minh',
      icon: '📅',
      color: 'from-orange-500 to-red-500'
    },
  ]

  const functions2 = [
  {
      title: 'Mood Tracking Analytics',
      description: 'Theo dõi và phân tích tâm trạng theo thời gian',
      icon: '📈',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Mindfulness & Meditation',
      description: 'Hướng dẫn thiền định và chánh niệm cá nhân hóa',
      icon: '🧘‍♀️',
      color: 'from-teal-500 to-green-500'
    },
    {
      title: 'Crisis Intervention AI',
      description: 'Hỗ trợ khẩn cấp 24/7 với AI đặc biệt',
      icon: '🚨',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Personal Growth Roadmap',
      description: 'Lộ trình phát triển bản thân được cá nhân hóa',
      icon: '🌱',
      color: 'from-lime-500 to-green-500'
    }
  ]

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-auto">
      <div className="fixed bg-[#3b142a] h-[74px] py-4 top-0 left-0 w-full z-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="px-4 flex justify-between items-center">
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

            <div className="flex items-center gap-4">
              <Link to="/login">
                <RippleButton
                  className="w-[112px] h-[36px] text-[13px] !font-bold rounded-sm text-[#f3efda] bg-transparent hover:!bg-[#dddddd1f]"
                  type='button'
                >
                  Đăng nhập
                </RippleButton>
              </Link>
              
              <Link to="/signup">
                <RippleButton
                  className="w-[90px] h-[36px] text-[13px] !font-bold rounded-sm text-white bg-[#e85cac] hover:!bg-[#e85cac]"
                  type='button'
                >
                  Đăng ký
                </RippleButton>
              
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#f3efda]">
        <div className="max-w-[1280px] mx-auto pt-[140px] pb-20 px-4">
          <div className="mb-20">
            <h2 className="text-[54px] text-[#3b142a] font-normal text-center">
              Bắt đầu hành trình <span className="font-semibold italic">Ngay</span>
            </h2>

            <div>

            </div>
            <div className="flex gap-4 mt-12 justify-center max-sm:flex-col">
              <RippleButton
                className="w-[180px] flex-col items-start h-[64px] text-[13px] !font-bold rounded-sm text-white bg-[#e85cac] hover:!bg-[#e85cac]"
                type='button'
                onClick={() => navigate('/login')}
              >
                <p className="font-semibold">USERS</p>
                <p className="text-[16px]">Dùng miễn phí</p>
              </RippleButton>
              <RippleButton
                className="w-[180px] flex-col items-start h-[64px] text-[13px] !font-bold rounded-sm text-white bg-[#3b142a] hover:!bg-[#3b142a]"
                type='button'
              >
                <p className="font-semibold">ADMINS</p>
                <p className="text-[16px]">Đăng nhập ngay</p>
              </RippleButton>
            </div>
          </div>
          
          <div className="relative mt-28">
            <div className="absolute left-0 top-[-47px] w-full h-[54px] max-lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1280 54" fill="#f3efda">
                {/* <rect width="1280" height="53" transform="translate(0 0.144043)" fill="#f3efda"></rect> */}
                <path d="M1280 8.46485V53.144L7.00195 50.2089L1271.69 0.471034C1276.22 0.292559 1280 3.92326 1280 8.46485Z" fill="#3B142A"></path>
              </svg>
            </div>
            <div className="min-h-[400px] bg-[#3b142a] rounded-tl-lg rounded-br-lg rounded-bl-lg max-lg:rounded-tr-lg">
              <div className="px-18 py-8 max-md:px-12 max-sm:px-8">
                <div className="flex gap-8 justify-between max-lg:flex-col">
                  <div>
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
                  </div>

                <div className="flex gap-8 justify-between max-md:flex-col">
                  <div>
                    {
                      functions.map((func, index) => (
                        <div key={index} className="flex items-center gap-4 mb-6">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${func.color} flex items-center justify-center text-[#f2f2da] text-[24px]`}>
                            {func.icon}
                          </div>
                          <div>
                            <h3 className="text-[#f2f2da] text-[14px] font-semibold">{func.title}</h3>
                            <p className="text-[#f2f2da] text-[11px]">{func.description}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  
                  <div>
                    {
                      functions2.map((func, index) => (
                        <div key={index} className="flex items-center gap-4 mb-6">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${func.color} flex items-center justify-center text-[#f2f2da] text-[24px]`}>
                            {func.icon}
                          </div>
                          <div>
                            <h3 className="text-[#f2f2da] text-[14px] font-semibold">{func.title}</h3>
                            <p className="text-[#f2f2da] text-[11px]">{func.description}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                  <div className="flex flex-col gap-4">
                    <div className="w-full max-w-[200px]">
                      <img
                        src="./images/app/appStore.avif"
                        alt="Hero Banner"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                    
                    <div className="w-full max-w-[200px]">
                      <img
                        src="./images/app/googlePlay.avif"
                        alt="Feature Showcase"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#ffffff2c] mt-4 pt-8 flex justify-between items-center">
                  <p className="text-[#f3efda] text-[14px]">© 2025 Trau Lai Xe. All rights reserved.</p>

                  <div className="flex items-center gap-4">
                    <div className="text-[#e8589d] hover:text-[#f3efda] transition-colors duration-300 cursor-pointer">
                      <FaFacebook size={24} />
                    </div>
                    <div className="text-[#e8589d] hover:text-[#f3efda] transition-colors duration-300 cursor-pointer">
                      <FaSquareXTwitter size={24} />
                    </div>
                    <div className="text-[#e8589d] hover:text-[#f3efda] transition-colors duration-300 cursor-pointer">
                      <FaInstagramSquare size={24} />
                    </div>
                    <div className="text-[#e8589d] hover:text-[#f3efda] transition-colors duration-300 cursor-pointer">
                      <FaPinterest size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}