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
    setCategorySearchQuery,
    darkMode
}) => {
    const { t } = useTranslation()

    // Style giống với LanguageSwitcher
    const styles = {
        dropdownPanel: {
            backgroundColor: darkMode ? '#1e293b' : undefined,
            borderColor: darkMode ? '#334155' : undefined,
        },
        dropdownItem: {
            backgroundColor: darkMode ? '#1e293b' : undefined,
            color: darkMode ? 'white' : undefined,
        }
    }

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
                className={`md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 ${darkMode ? 'dark-dropdown' : ''}`}
                filter
                onFilter={(e) => setCategorySearchQuery(e.filter)}
                panelClassName={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} [&_.p-dropdown-item:hover]:${darkMode ? '!bg-gray-700' : 'bg-gray-100'} [&_.p-dropdown-item.p-highlight]:${darkMode ? 'bg-gray-700' : ''}`}
                pt={{
                    panel: { style: styles.dropdownPanel, className: 'p-dropdown-panel-dark' },
                    item: { 
                        style: styles.dropdownItem,
                        className: darkMode ? 'hover:!bg-gray-700 transition-colors duration-200' : 'hover:bg-gray-100 transition-colors duration-200'
                    },
                    list: { 
                        className: darkMode ? 'bg-gray-800 text-white [&_.p-dropdown-item:hover]:bg-gray-700' : '' 
                    },
                    wrapper: { className: darkMode ? 'bg-gray-800 text-white border-gray-700' : '' },
                    header: { className: darkMode ? 'bg-gray-800 text-white' : '' },
                    filterInput: { className: darkMode ? 'bg-gray-800 text-white border-gray-700' : '' },
                    trigger: { 
                        className: darkMode ? 'text-white hover:!bg-gray-700 transition-colors duration-200' : 'hover:bg-gray-100 transition-colors duration-200' 
                    },
                    label: { className: darkMode ? 'text-white' : '' },
                }}
            />
            
            <Dropdown
                value={selectedStatus}
                options={statuses}
                onChange={(e) => setSelectedStatus(e.value)}
                placeholder={t('common.select_status')}
                className={`md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 ${darkMode ? 'dark-dropdown' : ''}`}
                panelClassName={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} [&_.p-dropdown-item:hover]:${darkMode ? '!bg-gray-700' : 'bg-gray-100'} [&_.p-dropdown-item.p-highlight]:${darkMode ? 'bg-gray-700' : ''}`}
                pt={{
                    panel: { style: styles.dropdownPanel, className: 'p-dropdown-panel-dark' },
                    item: { 
                        style: styles.dropdownItem,
                        className: darkMode ? 'hover:!bg-gray-700 transition-colors duration-200' : 'hover:bg-gray-100 transition-colors duration-200'
                    },
                    list: { 
                        className: darkMode ? 'bg-gray-800 text-white [&_.p-dropdown-item:hover]:bg-gray-700' : '' 
                    },
                    wrapper: { className: darkMode ? 'bg-gray-800 text-white border-gray-700' : '' },
                    header: { className: darkMode ? 'bg-gray-800 text-white' : '' },
                    filterInput: { className: darkMode ? 'bg-gray-800 text-white border-gray-700' : '' },
                    trigger: { 
                        className: darkMode ? 'text-white hover:!bg-gray-700 transition-colors duration-200' : 'hover:bg-gray-100 transition-colors duration-200' 
                    },
                    label: { className: darkMode ? 'text-white' : '' },
                }}
            />
        </div>
    )
}

export default BookFilters 