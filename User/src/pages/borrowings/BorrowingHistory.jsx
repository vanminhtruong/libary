import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useBorrowingHistory } from './hooks';
import './styles/BorrowingHistory.css';
import { 
    StatusTag, 
    BookInfo, 
    ActionButtons, 
    TableHeader, 
    EmptyState 
} from './components';

const BorrowingHistory = () => {
    const { t } = useTranslation();
    const {
        toast,
        borrowingHistory,
        loading,
        totalRecords,
        lazyParams,
        visibleColumns,
        loadBorrowingHistory,
        onPage,
        formatDate,
        getStatusSeverity,
        getBookImageUrl
    } = useBorrowingHistory();

    // Hiển thị trạng thái mượn sách
    const statusBodyTemplate = (rowData) => {
        return (
            <StatusTag 
                status={rowData.status}
                returnDate={rowData.return_date}
                visibleColumns={visibleColumns}
                formatDate={formatDate}
                getStatusSeverity={getStatusSeverity}
            />
        );
    };

    // Hiển thị ngày tháng
    const dateBodyTemplate = (rowData, field) => {
        return formatDate(rowData[field]);
    };

    // Hiển thị thông tin sách
    const bookBodyTemplate = (rowData) => {
        return (
            <BookInfo 
                book={rowData.book}
                borrowDate={rowData.borrow_date}
                dueDate={rowData.due_date}
                visibleColumns={visibleColumns}
                formatDate={formatDate}
                getBookImageUrl={getBookImageUrl}
            />
        );
    };

    // Hiển thị nút hành động
    const actionBodyTemplate = (rowData) => {
        return <ActionButtons bookId={rowData.book_id} />;
    };

    return (
        <div className="borrowing-history-container min-h-screen bg-gray-50 dark:bg-black">
            <Toast ref={toast} />

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {t('borrowings.borrowing_history')}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {t('borrowings.history_description')}
                    </p>
                </div>

                <Card className="shadow-md border-0 bg-white dark:bg-gray-800 dark:text-white overflow-hidden [&_.p-card-content]:!p-0 [&_.p-card-body]:bg-white [&_.p-card-body]:dark:bg-gray-800 [&_*]:dark:!bg-gray-800 [&_*]:dark:!text-white">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="overflow-x-auto">
                            <DataTable
                                value={borrowingHistory}
                                lazy
                                paginator
                                first={lazyParams.first}
                                rows={lazyParams.rows}
                                totalRecords={totalRecords}
                                onPage={onPage}
                                loading={loading}
                                header={<TableHeader onRefresh={loadBorrowingHistory} />}
                                emptyMessage={<EmptyState />}
                                className="borrowing-history-table p-datatable-sm"
                                stripedRows
                                rowHover
                                dataKey="id"
                                responsiveLayout="stack"
                                breakpoint="768px"
                                pt={{
                                    root: { className: 'dark:bg-gray-800' },
                                    header: { className: 'dark:bg-gray-800 dark:text-white border-none p-4' },
                                    thead: { className: 'dark:bg-gray-800' },
                                    tbody: { className: 'dark:bg-gray-800' },
                                    tfoot: { className: 'dark:bg-gray-800' },
                                    paginator: { className: 'dark:bg-gray-800 dark:text-white border-none dark:border-t dark:border-gray-700 p-3' },
                                    paginatorButton: { className: 'dark:text-white dark:hover:bg-gray-700 dark:border-gray-700' },
                                    headerRow: { className: 'dark:bg-gray-800 dark:text-white' },
                                    headerCell: { className: 'dark:bg-gray-800 dark:text-white' },
                                    bodyRow: { className: 'dark:bg-gray-800 dark:text-white border-b dark:border-gray-700' },
                                    bodyCell: { className: 'dark:bg-gray-800 dark:text-white' },
                                    rowExpansion: { className: 'dark:bg-gray-800' },
                                    emptyMessage: { className: 'dark:bg-gray-800 dark:text-white' }
                                }}
                            >
                                <Column
                                    field="book"
                                    header={t('common.book')}
                                    body={bookBodyTemplate}
                                    style={{ minWidth: '200px' }}
                                    className="dark:bg-gray-800"
                                />
                                {visibleColumns.borrow_date && (
                                    <Column
                                        field="borrow_date"
                                        header={t('borrowings.borrow_date')}
                                        body={(rowData) => dateBodyTemplate(rowData, 'borrow_date')}
                                        style={{ minWidth: '120px' }}
                                        className="column-borrow-date dark:bg-gray-800"
                                    />
                                )}
                                {visibleColumns.due_date && (
                                    <Column
                                        field="due_date"
                                        header={t('borrowings.due_date')}
                                        body={(rowData) => dateBodyTemplate(rowData, 'due_date')}
                                        style={{ minWidth: '120px' }}
                                        className="column-due-date dark:bg-gray-800"
                                    />
                                )}
                                {visibleColumns.return_date && (
                                    <Column
                                        field="return_date"
                                        header={t('borrowings.return_date')}
                                        body={(rowData) => dateBodyTemplate(rowData, 'return_date')}
                                        style={{ minWidth: '120px' }}
                                        className="column-return-date dark:bg-gray-800"
                                    />
                                )}
                                <Column
                                    field="status"
                                    header={t('common.status')}
                                    body={statusBodyTemplate}
                                    style={{ minWidth: '120px' }}
                                    className="dark:bg-gray-800"
                                />
                                <Column
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    style={{ minWidth: '80px', textAlign: 'center' }}
                                    className="dark:bg-gray-800"
                                />
                            </DataTable>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BorrowingHistory;
