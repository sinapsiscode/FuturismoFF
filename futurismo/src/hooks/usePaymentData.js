import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getMockPaymentMethods, getEmptyPaymentMethod } from '../data/mockProfileData';
import { PAYMENT_METHOD_TYPES } from '../constants/profileConstants';

const usePaymentData = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [newPaymentMethod, setNewPaymentMethod] = useState(getEmptyPaymentMethod());
  
  // Initialize with translated mock data
  const mockData = getMockPaymentMethods();
  const [paymentMethods, setPaymentMethods] = useState(
    mockData.map(method => ({
      ...method,
      bank: t(method.bank),
      holderName: t(method.holderName)
    }))
  );

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length < 8) return cleaned;
    return `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(-4)}`;
  };

  const toggleShowCardNumber = (id) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.type && newPaymentMethod.bank && newPaymentMethod.holderName) {
      const method = {
        id: Date.now(),
        ...newPaymentMethod,
        bank: t(newPaymentMethod.bank),
        holderName: t(newPaymentMethod.holderName)
      };
      setPaymentMethods([...paymentMethods, method]);
      setNewPaymentMethod(getEmptyPaymentMethod());
      toast.success(t('profile.payment.methodAdded'));
    }
  };

  const handleDeletePaymentMethod = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isMain) {
      toast.error(t('profile.payment.cannotDeleteMain'));
      return;
    }
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success(t('profile.payment.methodDeleted'));
  };

  const handleSetAsMain = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isMain: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    toast.success(t('profile.payment.mainMethodUpdated'));
  };

  const handleUpdateMethod = (id, field, value) => {
    const updatedMethods = paymentMethods.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setPaymentMethods(updatedMethods);
  };

  const handleSave = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Saving payment methods:', paymentMethods);
    }
    setIsEditing(false);
    toast.success(t('profile.payment.saved'));
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setPaymentMethods(
      mockData.map(method => ({
        ...method,
        bank: t(method.bank),
        holderName: t(method.holderName)
      }))
    );
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case PAYMENT_METHOD_TYPES.BANK_ACCOUNT:
        return t('profile.payment.types.bankAccount');
      case PAYMENT_METHOD_TYPES.CREDIT_CARD:
        return t('profile.payment.types.creditCard');
      default:
        return type;
    }
  };

  return {
    isEditing,
    setIsEditing,
    isCollapsed,
    setIsCollapsed,
    showCardNumbers,
    paymentMethods,
    newPaymentMethod,
    setNewPaymentMethod,
    maskCardNumber,
    toggleShowCardNumber,
    handleAddPaymentMethod,
    handleDeletePaymentMethod,
    handleSetAsMain,
    handleUpdateMethod,
    handleSave,
    handleCancel,
    getPaymentTypeLabel
  };
};

export default usePaymentData;