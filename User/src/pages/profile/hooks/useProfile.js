import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import userService from '../../../services/user.service';
import borrowingService from '../../../services/borrowing.service';

const useProfile = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    
    const [userProfile, setUserProfile] = useState(null);
    const [borrowings, setBorrowings] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
        };
        
        checkAuth();
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            // Load user profile
            const userData = await userService.getProfile();
            setUserProfile(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            
            // Load borrowings
            const borrowingsData = await borrowingService.getUserBorrowings();
            setBorrowings(borrowingsData.data || []);
            
            // Load reservations
            const reservationsData = await borrowingService.getUserReservations();
            setReservations(reservationsData.data || []);
            
        } catch (error) {
            console.error('Error loading user data:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('profile.error.load_data'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setSaveLoading(true);
        try {
            const response = await userService.updateProfile({
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                current_password: formData.current_password || undefined,
                new_password: formData.new_password || undefined
            });
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('profile.success.update'),
                life: 3000
            });
            
            setIsEditing(false);
            loadUserData(); // Reload user data
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('profile.error.update'),
                life: 3000
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const handleReturnBook = async (borrowingId) => {
        try {
            const response = await borrowingService.returnBook(borrowingId);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('borrowing.success.return'),
                life: 3000
            });
            
            // Reload borrowings
            const borrowingsData = await borrowingService.getUserBorrowings();
            setBorrowings(borrowingsData.data || []);
            
        } catch (error) {
            console.error('Error returning book:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('borrowing.error.return'),
                life: 3000
            });
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            const response = await borrowingService.cancelReservation(reservationId);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('reservation.success.cancel'),
                life: 3000
            });
            
            // Reload reservations
            const reservationsData = await borrowingService.getUserReservations();
            setReservations(reservationsData.data || []);
            
        } catch (error) {
            console.error('Error canceling reservation:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('reservation.error.cancel'),
                life: 3000
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        userProfile,
        borrowings,
        reservations,
        loading,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        formData,
        saveLoading,
        toast,
        updateFormData,
        handleUpdateProfile,
        handleReturnBook,
        handleCancelReservation,
        handleLogout
    };
};

export default useProfile; 