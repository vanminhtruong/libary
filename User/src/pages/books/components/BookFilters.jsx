import { Dropdown } from 'primereact/dropdown'
import { useTranslation } from 'react-i18next'

const BookFilters = ({ 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    categories,
    statuses,
    setCategorySearchQuery
}) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10"></i>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common.search')}
                    className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md pl-10 p-3 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </div>
            
            <Dropdown
                value={selectedCategory}
                options={categories}
                onChange={(e) => setSelectedCategory(e.value)}
                placeholder={t('common.select_category')}
                className="md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
                filter
                onFilter={(e) => setCategorySearchQuery(e.filter)}
            />
            
            <Dropdown
                value={selectedStatus}
                options={statuses}
                onChange={(e) => setSelectedStatus(e.value)}
                placeholder={t('common.select_status')}
                className="md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
            />
        </div>
    )
}

export default BookFilters 