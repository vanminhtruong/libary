import { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { format as dateFormat } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import bookService from '../../services/book.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_CONFIG } from '../../config/api.config';

const BorrowingHistory = () => {
    const toast = useRef(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [borrowingHistory, setBorrowingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });

    useEffect(() => {
        loadBorrowingHistory();
    }, [lazyParams]);

    const loadBorrowingHistory = async () => {
        try {
            setLoading(true);
            const response = await bookService.getBorrowingHistory();

            if (response && Array.isArray(response)) {
                setBorrowingHistory(response);
                setTotalRecords(response.length);
            } else if (response && response.data && Array.isArray(response.data)) {
                setBorrowingHistory(response.data);
                setTotalRecords(response.total || response.data.length);
            } else {
                setBorrowingHistory([]);
                setTotalRecords(0);
                toast.current.show({
                    severity: 'info',
                    summary: t('common.info'),
                    detail: t('borrowings.no_history'),
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error loading borrowing history:', error);
            setBorrowingHistory([]);
            setTotalRecords(0);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.history_load_error'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event) => {
        setLazyParams(event);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateFormat(new Date(dateString), 'dd/MM/yyyy');
    };

    const getStatusSeverity = (status) => {
        switch (status) {
            case 'borrowed':
                return 'info';
            case 'returned':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag
                value={t(`borrowings.status.${rowData.status}`)}
                severity={getStatusSeverity(rowData.status)}
            />
        );
    };

    const dateBodyTemplate = (rowData, field) => {
        return formatDate(rowData[field]);
    };

    const bookBodyTemplate = (rowData) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-10 h-14 overflow-hidden rounded">
                    <img
                        src={getBookImageUrl(rowData.book?.image)}
                        alt={rowData.book?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = '/default-book-cover.jpg'}
                    />
                </div>
                <div>
                    <div className="font-medium">{rowData.book?.title || t('common.unknown')}</div>
                    <div className="text-sm text-gray-500">{rowData.book?.author || '-'}</div>
                </div>
            </div>
        );
    };

    const getBookImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_CONFIG.BASE_URL}/books/image/${imagePath.split('/').pop()}`;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    severity="info"
                    onClick={() => navigate(`${ROUTES.BOOKS}/${rowData.book_id}`)}
                    tooltip={t('common.view_details')}
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-xl font-bold m-0">{t('borrowings.borrowing_history')}</h2>
        </div>
    );

    const emptyMessage = (
        <div className="text-center py-6 bg-white dark:bg-gray-800 w-full dark:text-white">
            <i className="pi pi-history text-5xl text-gray-300 dark:text-gray-500 mb-4"></i>
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">{t('borrowings.no_history')}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('borrowings.no_history_description')}</p>
            <Button
                label={t('borrowings.browse_books')}
                icon="pi pi-book"
                onClick={() => navigate(ROUTES.BOOKS)}
                className="p-button-outlined dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast ref={toast} />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {t('borrowings.borrowing_history')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('borrowings.history_description')}
                    </p>
                </div>

                <Card className="shadow-md border-0 bg-white dark:bg-gray-800 dark:text-white overflow-hidden [&_.p-card-content]:!p-0 [&_.p-card-body]:bg-white [&_.p-card-body]:dark:bg-gray-800 [&_*]:dark:!bg-gray-800 [&_*]:dark:!text-white">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <DataTable
                            value={borrowingHistory}
                            lazy
                            paginator
                            first={lazyParams.first}
                            rows={lazyParams.rows}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            loading={loading}
                            header={header}
                            emptyMessage={emptyMessage}
                            className="p-datatable-sm"
                            stripedRows
                            rowHover
                            dataKey="id"
                            pt={{
                                root: { className: 'dark:bg-gray-800' },
                                header: { className: 'dark:bg-gray-800 dark:text-white border-none' },
                                thead: { className: 'dark:bg-gray-800' },
                                tbody: { className: 'dark:bg-gray-800' },
                                tfoot: { className: 'dark:bg-gray-800' },
                                paginator: { className: 'dark:bg-gray-800 dark:text-white border-none dark:border-t dark:border-gray-700' },
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
                                style={{ minWidth: '250px' }}
                                className="dark:bg-gray-800"
                            />
                            <Column
                                field="borrow_date"
                                header={t('borrowings.borrow_date')}
                                body={(rowData) => dateBodyTemplate(rowData, 'borrow_date')}
                                style={{ minWidth: '120px' }}
                                className="dark:bg-gray-800"
                            />
                            <Column
                                field="due_date"
                                header={t('borrowings.due_date')}
                                body={(rowData) => dateBodyTemplate(rowData, 'due_date')}
                                style={{ minWidth: '120px' }}
                                className="dark:bg-gray-800"
                            />
                            <Column
                                field="return_date"
                                header={t('borrowings.return_date')}
                                body={(rowData) => dateBodyTemplate(rowData, 'return_date')}
                                style={{ minWidth: '120px' }}
                                className="dark:bg-gray-800"
                            />
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
                                style={{ minWidth: '100px', textAlign: 'center' }}
                                className="dark:bg-gray-800"
                            />
                        </DataTable>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BorrowingHistory;
