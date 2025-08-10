import PropTypes from 'prop-types';
import useProviderForm from '../../hooks/useProviderForm';
import ProviderFormHeader from './ProviderFormHeader';
import ProviderBasicInfo from './ProviderBasicInfo';
import ProviderContactInfo from './ProviderContactInfo';
import ProviderServicesSection from './ProviderServicesSection';
import ProviderPricingSection from './ProviderPricingSection';

const ProviderForm = ({ provider, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    services,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    onSubmit,
    handleCancel
  } = useProviderForm(provider, onSave, onCancel);

  const selectedCategory = watch('category');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProviderFormHeader
          isEditing={!!provider}
          onCancel={handleCancel}
          onSubmit={handleSubmit(onSubmit)}
        />

        <div className="space-y-6">
          <ProviderBasicInfo 
            register={register} 
            errors={errors} 
            watch={watch} 
          />

          <ProviderContactInfo 
            register={register} 
            errors={errors} 
          />

          <ProviderServicesSection
            services={services}
            handleAddService={handleAddService}
            handleRemoveService={handleRemoveService}
            handleServiceChange={handleServiceChange}
            selectedCategory={selectedCategory}
          />

          <ProviderPricingSection
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>
      </form>
    </div>
  );
};

ProviderForm.propTypes = {
  provider: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ProviderForm;