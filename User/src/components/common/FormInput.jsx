import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';

const FormInput = ({
    type = 'text',
    value,
    onChange = () => {},
    label,
    name,
    error,
    options,
    placeholder,
    className,
    required,
    disabled,
    icon,
    touched = false,
    ...rest
}) => {
    const toast = useRef(null);
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        if (typeof onChange !== 'function') {
            console.warn('Warning: onChange prop is not a function');
            return;
        }

        let newValue = e.target?.value;
        
        if (type === 'number') {
            newValue = e.value;
        } else if (type === 'dropdown') {
            newValue = e.value;
        }
        
        onChange(newValue);
    };

    const handleBlur = (e) => {
        if (rest.onBlur) {
            rest.onBlur(e);
        }
    };

    const baseClassName = classNames(
        'w-full transition-all duration-200',
        'border border-gray-300/50 dark:border-gray-600/50',
        'rounded-xl shadow-sm bg-white dark:bg-gray-800',
        'px-4 py-2.5',
        'focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20',
        'dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'hover:border-blue-500/30 dark:hover:border-blue-400/30',
        '[&_input]:bg-transparent [&_input]:dark:bg-transparent',
        '[&_input:focus]:bg-transparent [&_input:focus]:dark:bg-transparent',
        '[&_input:active]:bg-transparent [&_input:active]:dark:bg-transparent',
        '[&_.p-inputtext]:bg-transparent [&_.p-inputtext]:dark:bg-transparent',
        { 'p-invalid ring-2 ring-red-500/20 border-red-500/50': error || (touched && required && !value && value !== 0) },
        { 'opacity-60 cursor-not-allowed': disabled },
        className
    );

    const labelClassName = classNames(
        'block text-sm font-medium mb-1.5',
        'text-gray-700 dark:text-gray-200',
        { 'opacity-60': disabled }
    );

    const iconClassName = classNames(
        'absolute left-4 top-1/2 -translate-y-1/2',
        'text-gray-400 dark:text-gray-500',
        { 'text-red-400 dark:text-red-500': error }
    );

    const renderInput = () => {
        const commonProps = {
            id: name,
            name,
            disabled,
            placeholder,
            onBlur: handleBlur,
            ...rest
        };

        switch (type) {
            case 'number':
                return (
                    <div className="relative">
                        {icon && <i className={`${iconClassName} ${icon}`} />}
                        <InputNumber
                            value={value}
                            onValueChange={handleChange}
                            className={classNames(baseClassName, icon && 'pl-11')}
                            inputClassName="border-0 focus:ring-0 w-full p-0"
                            showButtons={false}
                            {...commonProps}
                        />
                    </div>
                );
            
            case 'textarea':
                return (
                    <InputTextarea
                        value={value}
                        onChange={handleChange}
                        className={classNames(baseClassName, 'resize-none min-h-[100px]')}
                        rows={4}
                        {...commonProps}
                    />
                );
            
            case 'password':
                return (
                    <div className="relative">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <i className="pi pi-lock"></i>
                            </span>
                            <InputText
                                type={showPassword ? 'text' : 'password'}
                                value={value}
                                onChange={handleChange}
                                className={classNames(baseClassName, 'pl-11', 'pr-10')}
                                {...commonProps}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} text-lg`}></i>
                            </button>
                        </div>
                    </div>
                );
            
            case 'date':
                return (
                    <div className="relative">
                        <Calendar
                            value={value}
                            onChange={handleChange}
                            className={baseClassName}
                            inputClassName="border-0 focus:ring-0 w-full p-0"
                            showIcon
                            panelStyle={{ position: 'fixed' }}
                            {...commonProps}
                        />
                    </div>
                );
            
            case 'dropdown':
                return (
                    <div className="relative">
                        {icon && <i className={`${iconClassName} ${icon}`} />}
                        <Dropdown
                            value={value}
                            onChange={handleChange}
                            options={options}
                            className={classNames(baseClassName, icon && 'pl-11')}
                            {...commonProps}
                        />
                    </div>
                );
            
            default:
                return (
                    <div className="relative">
                        {icon && <i className={`${iconClassName} ${icon}`} />}
                        <InputText
                            type={type}
                            value={value}
                            onChange={handleChange}
                            className={classNames(baseClassName, icon && 'pl-11')}
                            {...commonProps}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="field mb-6">
            <Toast ref={toast} />
            {label && (
                <label htmlFor={name} className={labelClassName}>
                    {t(label)}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {renderInput()}
                {(error || (touched && required && !value && value !== 0)) && (
                    <small className="absolute -bottom-5 left-0 text-red-500 text-xs mt-1 font-medium">
                        {error || t('validation.required')}
                    </small>
                )}
            </div>
        </div>
    );
};

export default FormInput; 