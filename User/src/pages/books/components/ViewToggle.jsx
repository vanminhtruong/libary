import { Button } from 'primereact/button'

const ViewToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="p-buttonset">
            <Button 
                icon="pi pi-th-large" 
                outlined={viewMode !== 'grid'}
                onClick={() => setViewMode('grid')}
                className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <Button 
                icon="pi pi-list" 
                outlined={viewMode !== 'list'}
                onClick={() => setViewMode('list')}
                className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
            />
        </div>
    )
}

export default ViewToggle 