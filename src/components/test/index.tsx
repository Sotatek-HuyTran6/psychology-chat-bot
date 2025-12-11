import { TableData } from "@/components/common/TableData";
import { useGetTests } from "@/hooks/features/useTest";
import type { ColumnsTypeExtend, Test } from "@/types";
import { EyeOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

export const TestPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);


  // Fetch tests with pagination
  const { data: testsData, isLoading, isError, refetch } = useGetTests({
    page: currentPage,
    limit: pageSize,
  });

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleStartTest = (testId: number) => {
    // TODO: Implement test start logic
    console.log('Starting test:', testId);
  };

  const handleViewTest = (testId: number) => {
    // TODO: Implement test view logic
    console.log('Viewing test:', testId);
  };

  const columns: ColumnsTypeExtend<Test> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '25%',
      render: (id: number) => (
        <div className="font-medium text-[#3b142a]">{id}</div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt: string) => (
        <div className="text-gray-600">
          {dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      render: (_, record: Test) => (
        <div className="flex gap-2">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTest(record.id)}
            />
          </Tooltip>
          {(record.status === 'pending' || record.status === 'failed') && (
            <Tooltip title="Bắt đầu làm bài">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartTest(record.id)}
                className="text-green-600 hover:text-green-700"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className='overflow-y-auto h-[calc(100vh-64px)] bg-[#f3efda] text-[#3b142a]'>
        <div className="max-w-4xl w-full mx-auto p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải danh sách bài kiểm tra</p>
            <Button onClick={() => refetch()} type="primary">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-y-auto h-[calc(100vh-64px)] bg-[#f3efda] text-[#3b142a]'>
      <div className="max-w-4xl w-full mx-auto px-6 pt-6 pb-12">
        <div className="mb-8" style={{ animation: `fade-in ${300 + 0 * 150}ms ease-in-out` }}>
          <h1 className="text-3xl font-bold text-[#3b142a] mb-2 mt-4">Bài kiểm tra tâm lý nhanh</h1>
          <p className="text-[#3b142a]">
            Hãy trả lời các câu hỏi sau để đánh giá nhanh tình trạng tâm lý của bạn
          </p>
        </div>

        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#3b142a]">
              Các bài kiểm tra ({testsData?.pagination.total || 0})
            </h2>
          </div>
          
          <TableData
            columns={columns}
            dataSource={testsData?.data || []}
            isFilterable={false}
            isLoading={isLoading}
            rowKey="id"
            currentPage={currentPage}
            pageSize={pageSize}
            total={testsData?.pagination.total || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};
