import RippleButton from '@/components/common/RippleButton';
import { useCreateNote, useDeleteNote, useGenerateDailySchedule, useGetNotes } from '@/hooks/features/useNotes';
import { useAuthStore } from '@/stores/authStore';
import type { CreateNotePayload } from '@/types';
import { DeleteOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, List, message, Modal, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';

export const NotingPage = () => {
  const [form] = Form.useForm();
  const { mutate: generateSchedule, isPending: isGenerating } = useGenerateDailySchedule();
  const { user } = useAuthStore();

  // React Query hooks
  const { data: notes = [], isLoading, isError, refetch } = useGetNotes();
  const createNoteMutation = useCreateNote();
  const deleteNoteMutation = useDeleteNote();

  const handleAddNote = (values: {
    time: Dayjs;
    content: string;
    importance: 'medium' | 'critical';
  }) => {
    const payload: CreateNotePayload = {
      time: dayjs(values.time).toISOString(),
      content: values.content,
      importance: values.importance,
    };

    createNoteMutation.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        message.success('Đã thêm ghi chú thành công!');
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra khi thêm ghi chú!');
      },
    });
  };

  const handleDeleteNote = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ghi chú này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => {
        deleteNoteMutation.mutate(id, {
          onSuccess: () => {
            message.success('Đã xóa ghi chú!');
          },
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra khi xóa ghi chú!');
          },
        });
      },
    });
  };

   const createNoteWithAI = () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    generateSchedule(undefined, {
      onSuccess: (notes) => {
        message.success(`Đã tạo thành công ${notes.length} ghi chú bằng AI!`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error('Error generating notes:', error);
        message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo ghi chú bằng AI');
      },
    });
  };

  return (
    <div>
      <div className="max-w-4xl w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8" style={{ animation: `fade-in ${300 + 0 * 150}ms ease-in-out` }}>
          <h1 className="text-3xl font-bold text-[#3b142a] mb-2 mt-4">Lịch trình</h1>
          <p className="text-[#3b142a]">Tạo và quản lý các lịch trình của bạn</p>
        </div>

        {/* Form */}

        <div className='flex gap-8 max-lg:flex-col'>
          {/* List */}
          <div style={{ animation: `fade-in ${300 + 2 * 150}ms ease-in-out` }} className='flex-1'>
            {/* <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Danh sách lịch trình ({notes.length})
            </h2> */}
            {isLoading ? (
              <Card className="text-center py-8">
                <p className="text-[#3b142a]">Đang tải dữ liệu...</p>
              </Card>
            ) : isError ? (
              <Card className="text-center py-8">
                <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu!</p>
              </Card>
            ) : notes.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-[#3b142a]">Chưa có note nào. Hãy tạo note đầu tiên!</p>
              </Card>
            ) : (
              <List
                dataSource={notes}
                renderItem={(note, index) => {
                  const getImportanceLabel = (importance: string) => {
                    switch (importance) {
                      case 'medium':
                        return 'Nhắc nhở';
                      case 'critical':
                        return 'Quan trọng';
                      default:
                        return 'Nhắc nhở';
                    }
                  };

                  const getImportanceColor = (importance: string) => {
                    switch (importance) {
                      case 'medium':
                        return 'bg-blue-100 text-blue-700';
                      case 'critical':
                        return 'bg-green-100 text-green-700';
                      default:
                        return 'bg-blue-100 text-blue-700';
                    }
                  };

                  return (
                    <Card
                      style={{ animation: `fade-in ${600 + index * 150}ms ease-in-out` }}
                      key={note.id}
                      className="!mb-4 shadow hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-sm text-[#3b142a] font-medium">
                              {dayjs(note.time).format('DD/MM HH:mm')}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getImportanceColor(note.importance)}`}
                            >
                              {getImportanceLabel(note.importance)}
                            </span>
                            {note.isAiGenerated && (
                              <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                                AI
                              </span>
                            )}
                          </div>
                          <div className="text-[#3b142a] line-clamp-3 overflow-hidden text-ellipsis break-all ">{note.content}</div>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deleteNoteMutation.isPending}
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </Card>
                  );
                }}
              />
            )}
          </div>

           <div>
            <Card
              className="mb-6 shadow-lg min-h-[400px] w-[400px] max-lg:w-full"
              style={{ animation: `fade-in ${300 + 1 * 150}ms ease-in-out` }}
            >
              <Form form={form} layout="vertical" onFinish={handleAddNote}>
                <Form.Item
                  label="Thời gian"
                  name="time"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                >
                  <DatePicker
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn thời gian"
                    className="w-full"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    disabledTime={(current) => {
                      if (!current || !dayjs(current).isSame(dayjs(), 'day')) {
                        return {};
                      }
                      const now = dayjs();
                      return {
                        disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
                        disabledMinutes: (selectedHour) => {
                          if (selectedHour === now.hour()) {
                            return Array.from({ length: now.minute() }, (_, i) => i);
                          }
                          return [];
                        },
                      };
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="content"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea placeholder="Nhập nội dung ghi chú..."  autoSize={{ minRows: 1, maxRows: 5 }} />
                </Form.Item>

                <Form.Item
                  label="Mức ưu tiên"
                  name="importance"
                  initialValue="medium"
                  rules={[{ required: true, message: 'Vui lòng chọn mức độ quan trọng!' }]}
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="medium">Nhắc nhở</Radio.Button>
                    <Radio.Button value="critical">Quan trọng</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item className="mb-0">
                  <div className="flex gap-4">
                    <RippleButton
                      icon={<PlusOutlined />}
                      loading={createNoteMutation.isPending}
                      disabled={createNoteMutation.isPending}
                      className="w-[200px] h-[52px]! rounded-md text-white bg-[#3b142a] hover:!bg-[#3b142a]"
                      onClick={() => form.submit()}
                      type='button'
                    >
                      <span className='max-sm:hidden'>Tạo mới</span><span className='max-sm:inline-block hidden'>Mới</span>
                    </RippleButton>

                    <RippleButton
                      icon={<FileTextOutlined />}
                      onClick={createNoteWithAI}
                      loading={isGenerating}
                      disabled={isGenerating}
                      type='button'
                      className="w-[200px] h-[52px]! rounded-md text-white bg-[#3b142a] hover:!bg-[#3b142a]"
                    >
                      {isGenerating ? 'Đang tạo...' : <span><span className='max-sm:hidden'>Tạo bằng</span> AI</span>}
                    </RippleButton>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
