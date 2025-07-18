import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/form.css';

function Form() {
  const [formData, setFormData] = useState({
    applicantCitizenship: '',
    idNumber: '',
    passportNumber: '',
    otherNames: '',
    names: '',
    nationality: '',
    phone: '',
    emailAddress: '',
    personalDistrict: '',
    businessType: '',
    companyName: '',
    tinNumber: '',
    registrationDate: '',
    businessDistrict: '',
    purposeOfImportation: '',
    specifiedPurpose: '',
    productCategory: '',
    productName: '',
    weight: '',
    descriptionOfProducts: '',
    unitOfMeasurement: '',
    quantity: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mapping of nationalities to international call codes
  const countryCallCodes = {
    Rwandan: '+250',
    Kenyan: '+254',
    Ugandan: '+256',
    Tanzanian: '+255',
    Burundian: '+257',
    Other: '+1' // Generic placeholder for "Other"
  };

  // Update phone with call code when nationality changes
  useEffect(() => {
    if (formData.nationality && formData.nationality in countryCallCodes) {
      setFormData((prev) => ({
        ...prev,
        phone: countryCallCodes[formData.nationality]
      }));
    } else if (!formData.nationality) {
      setFormData((prev) => ({ ...prev, phone: '' }));
    }
  }, [formData.nationality]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]); // Clear errors on input change
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.applicantCitizenship) {
      newErrors.push('Applicant citizenship is required');
    }
    if (formData.applicantCitizenship === 'Rwandan' && formData.idNumber.length !== 16) {
      newErrors.push('National ID number must be 16 digits');
    }
    if (formData.applicantCitizenship === 'Foreigner' && !formData.passportNumber) {
      newErrors.push('Passport number is required for Foreigner');
    }
    if (formData.applicantCitizenship === 'Foreigner' && formData.nationality === 'Rwandan') {
      newErrors.push('Nationality cannot be Rwandan for a Foreigner');
    }
    if (!formData.otherNames) {
      newErrors.push('Other names are required');
    }
    if (!formData.names) {
      newErrors.push('Surname is required');
    }
    if (!formData.nationality) {
      newErrors.push('Nationality is required');
    }
    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.push('Invalid email format');
    }
    if (!formData.personalDistrict) {
      newErrors.push('Personal district is required');
    }
    if (!formData.businessType) {
      newErrors.push('Business type is required');
    }
    if (!formData.companyName) {
      newErrors.push('Company name is required');
    }
    if (formData.tinNumber.length !== 9) {
      newErrors.push('TIN number must be 9 digits');
    }
    if (!formData.registrationDate) {
      newErrors.push('Registration date is required');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (formData.registrationDate && new Date(formData.registrationDate) > today) {
      newErrors.push('Registration date cannot be in the future');
    }
    if (!formData.businessDistrict) {
      newErrors.push('Business district is required');
    }
    if (!formData.purposeOfImportation) {
      newErrors.push('Purpose of importation is required');
    }
    if (formData.purposeOfImportation === 'Other' && !formData.specifiedPurpose) {
      newErrors.push('Specify purpose is required when purpose is Other');
    }
    if (!formData.productCategory) {
      newErrors.push('Product category is required');
    }
    if (!formData.productName) {
      newErrors.push('Product name is required');
    }
    if (!formData.descriptionOfProducts) {
      newErrors.push('Description of products is required');
    }
    if (!formData.unitOfMeasurement) {
      newErrors.push('Unit of measurement is required');
    }
    if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) {
      newErrors.push('Quantity must be greater than 0');
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const submitData = {
      applicantCitizenship: formData.applicantCitizenship,
      ...(formData.applicantCitizenship === 'Rwandan' && { idNumber: formData.idNumber }),
      ...(formData.applicantCitizenship === 'Foreigner' && { passportNumber: formData.passportNumber }),
      otherNames: formData.otherNames,
      names: formData.names,
      nationality: formData.nationality,
      phone: formData.phone,
      emailAddress: formData.emailAddress,
      personalDistrict: formData.personalDistrict,
      businessType: formData.businessType,
      companyName: formData.companyName,
      tinNumber: formData.tinNumber,
      registrationDate: formData.registrationDate,
      businessDistrict: formData.businessDistrict,
      purposeOfImportation: formData.purposeOfImportation,
      ...(formData.purposeOfImportation === 'Other' && { specifiedPurpose: formData.specifiedPurpose }),
      productCategory: formData.productCategory,
      productName: formData.productName,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      descriptionOfProducts: formData.descriptionOfProducts,
      unitOfMeasurement: formData.unitOfMeasurement,
      quantity: formData.quantity ? parseInt(formData.quantity, 10) : 0
    };

    try {
      await axios.post('http://localhost:5000/api/application', submitData);
      setErrors(['Application submitted successfully!']);
      setFormData({
        applicantCitizenship: '',
        idNumber: '',
        passportNumber: '',
        otherNames: '',
        names: '',
        nationality: '',
        phone: '',
        emailAddress: '',
        personalDistrict: '',
        businessType: '',
        companyName: '',
        tinNumber: '',
        registrationDate: '',
        businessDistrict: '',
        purposeOfImportation: '',
        specifiedPurpose: '',
        productCategory: '',
        productName: '',
        weight: '',
        descriptionOfProducts: '',
        unitOfMeasurement: '',
        quantity: ''
      });
    } catch (error) {
      setIsLoading(false);
      const errorMessages = error.response?.data?.error
        ? Array.isArray(error.response.data.error)
          ? error.response.data.error
          : [error.response.data.error]
        : ['Failed to submit application. Please try again.'];
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="form-title">RICA Import Permit Application</h1>
        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <p key={index} className={errors[0].includes('successfully') ? 'success-message' : 'error-message'}>
                {error}
              </p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Business Owner Details */}
          <div className="form-section">
            <h2 className="section-title">Business Owner Details</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Applicant citizenship <span className="required">*</span></label>
                <select
                  name="applicantCitizenship"
                  value={formData.applicantCitizenship}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select citizenship</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Foreigner">Foreigner</option>
                </select>
              </div>
              <div className="input-group">
                <label>Surname <span className="required">*</span></label>
                <input
                  type="text"
                  name="names"
                  value={formData.names}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Other names <span className="required">*</span></label>
                <input
                  type="text"
                  name="otherNames"
                  value={formData.otherNames}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Nationality <span className="required">*</span></label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select nationality</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Ugandan">Ugandan</option>
                  <option value="Tanzanian">Tanzanian</option>
                  <option value="Burundian">Burundian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="input-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Enter an email address"
                />
              </div>
              {formData.applicantCitizenship === 'Rwandan' && (
                <div className="input-group">
                  <label>National ID number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="Enter 16-digit National ID"
                    required
                  />
                </div>
              )}
              {formData.applicantCitizenship === 'Foreigner' && (
                <div className="input-group">
                  <label>Passport number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="Enter passport number"
                    required
                  />
                </div>
              )}
            </div>
            <div className="input-group">
              <label>Business Owner Address</label>
              <div>
                <label>District <span className="required">*</span></label>
                <select
                  name="personalDistrict"
                  value={formData.personalDistrict}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select district</option>
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                  <option value="Burera">Burera</option>
                  <option value="Gakenke">Gakenke</option>
                  <option value="Gicumbi">Gicumbi</option>
                  <option value="Musanze">Musanze</option>
                  <option value="Rulindo">Rulindo</option>
                  <option value="Gisagara">Gisagara</option>
                  <option value="Huye">Huye</option>
                  <option value="Kamonyi">Kamonyi</option>
                  <option value="Muhanga">Muhanga</option>
                  <option value="Nyamagabe">Nyamagabe</option>
                  <option value="Nyanza">Nyanza</option>
                  <option value="Nyaruguru">Nyaruguru</option>
                  <option value="Ruhango">Ruhango</option>
                  <option value="Bugesera">Bugesera</option>
                  <option value="Gatsibo">Gatsibo</option>
                  <option value="Kayonza">Kayonza</option>
                  <option value="Kirehe">Kirehe</option>
                  <option value="Ngoma">Ngoma</option>
                  <option value="Nyagatare">Nyagatare</option>
                  <option value="Rwamagana">Rwamagana</option>
                  <option value="Karongi">Karongi</option>
                  <option value="Ngororero">Ngororero</option>
                  <option value="Nyabihu">Nyabihu</option>
                  <option value="Nyamasheke">Nyamasheke</option>
                  <option value="Rubavu">Rubavu</option>
                  <option value="Rusizi">Rusizi</option>
                  <option value="Rutsiro">Rutsiro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="form-section">
            <h2 className="section-title">Business Details</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Business type <span className="required">*</span></label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select business type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>
              </div>
              <div className="input-group">
                <label>Company name <span className="required">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="input-group">
                <label>TIN number <span className="required">*</span></label>
                <input
                  type="text"
                  name="tinNumber"
                  value={formData.tinNumber}
                  onChange={handleChange}
                  placeholder="Enter 9-digit TIN number"
                  required
                />
              </div>
              <div className="input-group">
                <label>Registration date <span className="required">*</span></label>
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Business Address</label>
              <div>
                <label>District <span className="required">*</span></label>
                <select
                  name="businessDistrict"
                  value={formData.businessDistrict}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select district</option>
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                  <option value="Burera">Burera</option>
                  <option value="Gakenke">Gakenke</option>
                  <option value="Gicumbi">Gicumbi</option>
                  <option value="Musanze">Musanze</option>
                  <option value="Rulindo">Rulindo</option>
                  <option value="Gisagara">Gisagara</option>
                  <option value="Huye">Huye</option>
                  <option value="Kamonyi">Kamonyi</option>
                  <option value="Muhanga">Muhanga</option>
                  <option value="Nyamagabe">Nyamagabe</option>
                  <option value="Nyanza">Nyanza</option>
                  <option value="Nyaruguru">Nyaruguru</option>
                  <option value="Ruhango">Ruhango</option>
                  <option value="Bugesera">Bugesera</option>
                  <option value="Gatsibo">Gatsibo</option>
                  <option value="Kayonza">Kayonza</option>
                  <option value="Kirehe">Kirehe</option>
                  <option value="Ngoma">Ngoma</option>
                  <option value="Nyagatare">Nyagatare</option>
                  <option value="Rwamagana">Rwamagana</option>
                  <option value="Karongi">Karongi</option>
                  <option value="Ngororero">Ngororero</option>
                  <option value="Nyabihu">Nyabihu</option>
                  <option value="Nyamasheke">Nyamasheke</option>
                  <option value="Rubavu">Rubavu</option>
                  <option value="Rusizi">Rusizi</option>
                  <option value="Rutsiro">Rutsiro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="form-section">
            <h2 className="section-title">Product Information</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Purpose of importation <span className="required">*</span></label>
                <select
                  name="purposeOfImportation"
                  value={formData.purposeOfImportation}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select purpose of importation</option>
                  <option value="Direct sale">Direct sale</option>
                  <option value="Personal use">Personal use</option>
                  <option value="Trial use">Trial use</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {formData.purposeOfImportation === 'Other' && (
              <div className="input-group">
                <label>Specify purpose of importation <span className="required">*</span></label>
                <input
                  type="text"
                  name="specifiedPurpose"
                  value={formData.specifiedPurpose}
                  onChange={handleChange}
                  placeholder="Enter specific purpose"
                  required
                />
              </div>
            )}
            <div className="input-group">
              <label>Product details</label>
              <div className="input-grid">
                <div className="input-group">
                  <label>Product category <span className="required">*</span></label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select product category</option>
                    <option value="General purpose">General purpose</option>
                    <option value="Construction materials">Construction materials</option>
                    <option value="Chemicals">Chemicals</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Product name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Weight kg"
                  />
                </div>
                <div className="input-group">
                  <label>Unit of measurement <span className="required">*</span></label>
                  <select
                    name="unitOfMeasurement"
                    value={formData.unitOfMeasurement}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select unit of measurement</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Tonnes">Tonnes</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Quantity of product(s) <span className="required">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Description of products <span className="required">*</span></label>
                <textarea
                  name="descriptionOfProducts"
                  value={formData.descriptionOfProducts}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;