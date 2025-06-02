import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
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
      <div className={`flex items-center gap-2 language-option ${darkMode ? 'text-white' : ''}`}>
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

  return (
    <Dropdown
      value={selectedLanguage}
      options={languages}
      onChange={changeLanguage}
      optionLabel="name"
      valueTemplate={selectedLanguageTemplate}
      itemTemplate={languageOptionTemplate}
      className={`language-switcher w-[170px] ${darkMode ? 'bg-gray-800 text-white border-gray-700 hover:border-gray-600' : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'}`}
      panelClassName={`language-panel ${darkMode ? 'bg-gray-800 border-gray-700 text-white [&_.p-dropdown-item]:text-white [&_.p-dropdown-item:hover]:bg-gray-700 [&_.p-dropdown-item.p-highlight]:bg-gray-700' : 'bg-white border-gray-300 [&_.p-dropdown-item:hover]:bg-gray-100 [&_.p-dropdown-item.p-highlight]:bg-gray-100'}`}
      pt={{
        panel: { 
          className: 'shadow-lg rounded-md overflow-hidden mt-2',
          style: darkMode ? { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', color: 'white', marginTop: '8px' } : { marginTop: '8px' }
        },
        item: {
          className: darkMode ? 'text-white hover:!bg-gray-700 transition-colors duration-200' : 'hover:!bg-gray-100 transition-colors duration-200',
          style: darkMode ? { color: 'white', backgroundColor: '#1a1a1a' } : {}
        },
        list: {
          className: darkMode ? 'bg-gray-800 text-white' : 'bg-white',
          style: darkMode ? { backgroundColor: '#1a1a1a', color: 'white' } : {}
        },
        wrapper: { 
          className: darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300',
          style: darkMode ? { backgroundColor: '#1a1a1a', color: 'white' } : {}
        },
        header: { 
          className: darkMode ? 'bg-gray-800 text-white' : '',
          style: darkMode ? { backgroundColor: '#1a1a1a', color: 'white' } : {}
        },
        filterInput: { 
          className: darkMode ? 'bg-gray-800 text-white border-gray-700' : '',
          style: darkMode ? { backgroundColor: '#1a1a1a', color: 'white' } : {}
        },
        trigger: {
          className: darkMode ? 'text-white hover:!bg-gray-700 transition-colors duration-200' : 'hover:bg-gray-100 transition-colors duration-200',
          style: darkMode ? { color: 'white' } : {}
        },
        label: { 
          className: darkMode ? 'text-white' : '',
          style: darkMode ? { color: 'white' } : {}
        },
      }}
    />
  );
};

export default LanguageSwitcher;