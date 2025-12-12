import { Descriptions, Skeleton, Tag, message } from 'antd';
import { useEffect } from 'react';
import { EMO_STATE, getEmojiByState } from '@/constant';
import { useMentalHealthEvaluation } from '@/hooks/features/useMentalHealthEvaluation';
import { useMentalHealthStore } from '@/stores/mentalHealthStore';
import RippleButton from '@/components/common/RippleButton';

interface MentalHealthProps {
  open: boolean;
  onClose: () => void;
}

const getStressLevelColor = (level: number) => {
  if (level <= 30) return 'green';
  if (level <= 60) return 'orange';
  return 'red';
};

const getStressLevelText = (level: number) => {
  if (level <= 30) return 'Thấp';
  if (level <= 60) return 'Trung bình';
  return 'Cao';
};

const getScoreColor = (score: number, max: number) => {
  const percentage = (score / max) * 100;
  if (percentage <= 33) return 'green';
  if (percentage <= 66) return 'orange';
  return 'red';
};

export const MentalHealth = ({ open, onClose }: MentalHealthProps) => {
  const { setEvaluation, evaluation } = useMentalHealthStore();
  const { data: evaluationData, isLoading, refetch, isFetching } = useMentalHealthEvaluation(open);

  useEffect(() => {
    if (evaluationData?.data?.evaluation) {
      setEvaluation(evaluationData?.data?.evaluation);
    }
  }, [evaluationData, setEvaluation]);

  const handleRecalculate = async () => {
    try {
      await refetch();
      message.success('Đã cập nhật lại các chỉ số!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tính toán lại chỉ số!');
      console.error(error);
    }
  };

  return (
    <div>
      {isLoading ? (
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : evaluation ? (
          <div>
            <div className="mb-8" style={{ animation: `fade-in ${300 + 0 * 150}ms ease-in-out` }}>
              <h1 className="text-3xl font-bold text-[#3b142a] mb-2 mt-4">Đánh giá sức khỏe tâm lý</h1>
              <p className="text-[#3b142a]">Sức khỏe tâm lý của bạn được đánh giá dựa trên các chỉ số sau</p>
            </div>
            {/* Tình trạng cảm xúc & Stress */}
            <div
              style={{ animation: `fade-in ${300 + 0 * 150}ms ease-in-out` }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="text-base font-semibold text-[#3b142a]">Tình Trạng Hiện Tại</h3>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Trạng thái cảm xúc">
                  <Tag className="text-sm">
                    {evaluation.emotion_state &&
                      getEmojiByState(evaluation.emotion_state as EMO_STATE)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Mức độ stress">
                  <Tag color={getStressLevelColor(evaluation.stress_level)} className="text-sm">
                    {evaluation.stress_level}/100 - {getStressLevelText(evaluation.stress_level)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* GAD-7 (Rối loạn lo âu) */}
            <div
              style={{ animation: `fade-in ${300 + 1 * 150}ms ease-in-out` }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="text-base font-semibold text-[#3b142a]">GAD-7 - Đánh Giá Lo Âu</h3>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Điểm số">
                  <Tag color={getScoreColor(evaluation.gad7_score, 21)} className="text-sm">
                    {evaluation.gad7_score}/21
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá">
                  <span className="text-sm">{evaluation.gad7_assessment}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* PSS-10 (Căng thẳng) */}
            <div
              style={{ animation: `fade-in ${300 + 2 * 150}ms ease-in-out` }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="text-base font-semibold text-[#3b142a]">
                PSS-10 - Đánh Giá Căng Thẳng
              </h3>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Điểm số">
                  <Tag color={getScoreColor(evaluation.pss10_score, 40)} className="text-sm">
                    {evaluation.pss10_score}/40
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá">
                  <span className="text-sm">{evaluation.pss10_assessment}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* MBI-SS (Burnout) */}
            <div
              style={{ animation: `fade-in ${300 + 3 * 150}ms ease-in-out` }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="text-base font-semibold text-[#3b142a]">MBI-SS - Đánh Giá Kiệt Sức</h3>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Kiệt sức về cảm xúc">
                  <Tag color={getScoreColor(evaluation.mbi_ss_score?.emotional_exhaustion, 30)}>
                    {evaluation.mbi_ss_score?.emotional_exhaustion}/30
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hoài nghi/Lãnh đạm">
                  <Tag color={getScoreColor(evaluation.mbi_ss_score?.cynicism, 30)}>
                    {evaluation.mbi_ss_score?.cynicism}/30
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hiệu quả chuyên môn">
                  <Tag color="blue">{evaluation.mbi_ss_score?.professional_efficacy}/36</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá tổng thể">
                  <span className="text-sm">{evaluation.mbi_ss_score?.assessment}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Đánh giá tổng quan */}
            <div
              style={{ animation: `fade-in ${300 + 4 * 150}ms ease-in-out` }}
              className="bg-[#ffc0ea49] p-4 rounded-lg border-2 border-[#e972be] mt-4"
            >
              <h3 className="text-base font-semibold text-[#3b142a] mb-2">
                Đánh Giá Tổng Quan Sức Khỏe Tâm Lý
              </h3>
              <p className="text-sm text-[#3b142a] leading-relaxed">
                {evaluation.overall_mental_health}
              </p>
            </div>

            <RippleButton
              onClick={handleRecalculate}
              loading={isFetching}
              type='button'
              className="w-[220px] h-[52px]! rounded-md text-white bg-[#3b142a] hover:!bg-[#3b142a] mt-6 mb-10"
            >
              Tính toán lại các chỉ số
            </RippleButton>
          </div>
        ) : (
          <div className="text-center py-12 text-[#3b142a]">
            <p>Không có dữ liệu đánh giá sức khỏe tâm lý.</p>
            <p className="text-sm mt-2">Vui lòng bắt đầu trò chuyện để nhận đánh giá.</p>
          </div>
        )}
    </div>
  );
};
