import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  // Initialize darkMode state by checking if the dark class is present on the document element
  // This ensures correct styling from the very beginning without flashing
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setDarkMode(isDarkMode);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  const selectedLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.value.code);
  };

  const languageOptionTemplate = (option) => {
    return (
      <div className={`flex items-center gap-2 language-option ${darkMode ? 'dark-mode' : ''}`}>
        <span className={`text-lg ${darkMode ? 'text-white' : ''}`}>{option.flag}</span>
        <span className={`${darkMode ? 'text-white' : ''}`}>{option.name}</span>
      </div>
    );
  };

  const selectedLanguageTemplate = (option, props) => {
    if (option) {
      return languageOptionTemplate(option);
    }
    return props.placeholder;
  };

  // Inline styles để giải quyết vấn đề hover màu trắng trong chế độ tối
  const styles = {
    dropdownPanel: {
      backgroundColor: darkMode ? '#1e293b' : undefined,
      borderColor: darkMode ? '#334155' : undefined,
    },
    dropdownItem: {
      backgroundColor: darkMode ? '#1e293b' : undefined,
      color: darkMode ? 'white' : undefined,
    },
    hoverItem: {
      ':hover': {
        backgroundColor: darkMode ? '#334155' : '#f3f4f6',
      }
    }
  };

  return (
    <Dropdown
      value={selectedLanguage}
      options={languages}
      onChange={changeLanguage}
      optionLabel="name"
      valueTemplate={selectedLanguageTemplate}
      itemTemplate={languageOptionTemplate}
      className={`language-switcher w-[170px] ${darkMode ? 'bg-gray-800 text-white border-gray-700 hover:border-gray-600' : ''}`}
      panelClassName={`language-panel ${darkMode ? 'bg-gray-800 border-gray-700 [&_.p-dropdown-item:hover]:bg-gray-700 [&_.p-dropdown-item.p-highlight]:bg-gray-700' : '[&_.p-dropdown-item:hover]:bg-gray-100 [&_.p-dropdown-item.p-highlight]:bg-gray-100'}`}
      pt={{
        panel: { style: styles.dropdownPanel, className: 'p-dropdown-panel-dark' },
        item: {
          style: styles.dropdownItem,
          className: darkMode ? 'hover:!bg-gray-700 transition-colors duration-200' : 'hover:!bg-gray-100 transition-colors duration-200'
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
      style={{
        ...(darkMode && {
          '--hover-bg': 'rgb(55, 65, 81)',
        })
      }}
    />
  );
};

export default LanguageSwitcher;