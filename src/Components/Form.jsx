import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/form.css';

function Form() {
  const [formData, setFormData] = useState({
    applicantCitizenship: '',
    idNumber: '',
    passportNumber: '',
    otherNames: '',
    surname: '',
    nationality: '',
    phoneNumber: '',
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mapping of nationalities to international call codes
  const countryCallCodes = {
    Rwandan: '+250',
    Kenyan: '+254',
    Ugandan: '+256',
    Tanzanian: '+255',
    Burundian: '+257',
    Other: '+1'
  };

  // Update phone with call code when nationality changes
  useEffect(() => {
    if (formData.nationality && formData.nationality in countryCallCodes) {
      const currentNumber = formData.phoneNumber.replace(/^\+\d+\s?/, '').trim();
      setFormData((prev) => ({
        ...prev,
        phoneNumber: `${countryCallCodes[formData.nationality]} ${currentNumber}`
      }));
    } else if (!formData.nationality) {
      setFormData((prev) => ({ ...prev, phoneNumber: '' }));
    }
  }, [formData.nationality]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const currentCode = formData.phoneNumber.split(' ')[0] || countryCallCodes[formData.nationality] || '+250';
      setFormData((prev) => ({
        ...prev,
        phoneNumber: `${currentCode} ${value}`
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for the field being changed
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.applicantCitizenship) newErrors.applicantCitizenship = 'This field is required';
    if (formData.applicantCitizenship === 'Rwandan' && formData.idNumber.length !== 16) newErrors.idNumber = 'National ID number must be 16 digits';
    if (formData.applicantCitizenship === 'Foreigner' && !formData.passportNumber) newErrors.passportNumber = 'This field is required';
    if (formData.applicantCitizenship === 'Foreigner' && formData.nationality === 'Rwandan') newErrors.nationality = 'Nationality cannot be Rwandan for a Foreigner';
    if (!formData.otherNames) newErrors.otherNames = 'This field is required';
    if (!formData.surname) newErrors.surname = 'This field is required';
    if (!formData.nationality) newErrors.nationality = 'This field is required';
    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) newErrors.emailAddress = 'Invalid email format';
    if (!formData.personalDistrict) newErrors.personalDistrict = 'This field is required';
    if (!formData.businessType) newErrors.businessType = 'This field is required';
    if (!formData.companyName) newErrors.companyName = 'This field is required';
    if (!formData.tinNumber || formData.tinNumber.length !== 9) newErrors.tinNumber = 'Please provide a valid TIN number';
    if (!formData.registrationDate) newErrors.registrationDate = 'This field is required';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.registrationDate && new Date(formData.registrationDate) > today) newErrors.registrationDate = 'Registration date cannot be in the future';
    if (!formData.businessDistrict) newErrors.businessDistrict = 'This field is required';
    if (!formData.purposeOfImportation) newErrors.purposeOfImportation = 'This field is required';
    if (formData.purposeOfImportation === 'Other' && !formData.specifiedPurpose) newErrors.specifiedPurpose = 'This field is required';
    if (!formData.productCategory) newErrors.productCategory = 'This field is required';
    if (!formData.productName) newErrors.productName = 'This field is required';
    if (!formData.descriptionOfProducts) newErrors.descriptionOfProducts = 'This field is required';
    if (!formData.unitOfMeasurement) newErrors.unitOfMeasurement = 'This field is required';
    if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) newErrors.quantity = 'Please provide a number greater than zero';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const submitData = {
      applicantCitizenship: formData.applicantCitizenship,
      ...(formData.applicantCitizenship === 'Rwandan' && { idNumber: formData.idNumber }),
      ...(formData.applicantCitizenship === 'Foreigner' && { passportNumber: formData.passportNumber }),
      otherNames: formData.otherNames,
      names: formData.surname, // Map surname to backend 'names'
      nationality: formData.nationality,
      phoneNumber: formData.phoneNumber,
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
      setErrors({ submit: 'Application submitted successfully!' });
      setFormData({
        applicantCitizenship: '',
        idNumber: '',
        passportNumber: '',
        otherNames: '',
        surname: '',
        nationality: '',
        phoneNumber: '',
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
          ? { submit: error.response.data.error.join(', ') }
          : { submit: error.response.data.error }
        : { submit: 'Failed to submit application. Please try again.' };
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="form-title">RICA Import Permit Application</h1>
        <form onSubmit={handleSubmit}>
          {/* Business Owner Details */}
          <div className="form-section">
            <h2 className="section-title">Business Owner Details</h2>
            <div className="input-stack">
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
                {errors.applicantCitizenship && <p className="error-message">{errors.applicantCitizenship}</p>}
              </div>
              <div className="input-group">
                <label>Surname <span className="required">*</span></label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Enter surname"
                  required
                />
                {errors.surname && <p className="error-message">{errors.surname}</p>}
              </div>
              <div className="input-group">
                <label>Other names <span className="required">*</span></label>
                <input
                  type="text"
                  name="otherNames"
                  value={formData.otherNames}
                  onChange={handleChange}
                  placeholder="Enter other names"
                  required
                />
                {errors.otherNames && <p className="error-message">{errors.otherNames}</p>}
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
                {errors.nationality && <p className="error-message">{errors.nationality}</p>}
              </div>
              <div className="input-group">
                <label>Contact Information</label>
                <div className="input-row">
                  <div className="input-subgroup">
                    <label>Phone number</label>
                    <div className="phone-input-container">
                      <span className="country-code-display">
                        {formData.phoneNumber.split(' ')[0] || countryCallCodes[formData.nationality] || '+250'}
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber.split(' ')[1] || ''}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="phone-number-input"
                      />
                    </div>
                    {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                  </div>
                  <div className="input-subgroup">
                    <label>Email address</label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                    {errors.emailAddress && <p className="error-message">{errors.emailAddress}</p>}
                  </div>
                </div>
              </div>
              {formData.applicantCitizenship === 'Rwandan' && (
                <div className="input-group">
                  <label>Identification document number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="Enter Identification document number"
                    required
                  />
                  {errors.idNumber && <p className="error-message">{errors.idNumber}</p>}
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
                  {errors.passportNumber && <p className="error-message">{errors.passportNumber}</p>}
                </div>
              )}
              <div className="input-group">
                <label>Business Owner Address</label>
                <div className="input-subgroup">
                  <label>District <span className="required">*</span></label>
                  <select
                    name="personalDistrict"
                    value={formData.personalDistrict}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Enter district</option>
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
                  {errors.personalDistrict && <p className="error-message">{errors.personalDistrict}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="form-section">
            <h2 className="section-title">Business Details</h2>
            <div className="input-stack">
              <div className="input-row">
                <div className="input-group">
                  <label>Business type <span className="required">*</span></label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Enter Business Type</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Manufacturer">Manufacturer</option>
                  </select>
                  {errors.businessType && <p className="error-message">{errors.businessType}</p>}
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
                  {errors.companyName && <p className="error-message">{errors.companyName}</p>}
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>TIN number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="tinNumber"
                    value={formData.tinNumber}
                    onChange={handleChange}
                    placeholder="Enter TIN number"
                    required
                  />
                  {errors.tinNumber && <p className="error-message">{errors.tinNumber}</p>}
                </div>
                <div className="input-group">
                  <label>Registration date <span className="required">*</span></label>
                  <input
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="Select date"
                    required
                  />
                  {errors.registrationDate && <p className="error-message">{errors.registrationDate}</p>}
                </div>
              </div>
              <div className="input-group">
                <label>Business Address</label>
                <div className="input-subgroup">
                  <label>District <span className="required">*</span></label>
                  <select
                    name="businessDistrict"
                    value={formData.businessDistrict}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Enter district</option>
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
                  {errors.businessDistrict && <p className="error-message">{errors.businessDistrict}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="form-section">
            <h2 className="section-title">Importation details</h2>
            <div className="input-stack">
              <div className="input-group">
                <label>Purpose of importation <span className="required">*</span></label>
                <select
                  name="purposeOfImportation"
                  value={formData.purposeOfImportation}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select the purpose of importation</option>
                  <option value="Direct sale">Direct sale</option>
                  <option value="Personal use">Personal use</option>
                  <option value="Trial use">Trial use</option>
                  <option value="Other">Other</option>
                </select>
                {errors.purposeOfImportation && <p className="error-message">{errors.purposeOfImportation}</p>}
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
                  {errors.specifiedPurpose && <p className="error-message">{errors.specifiedPurpose}</p>}
                </div>
              )}
              <div className="input-group">
                <label>Product details</label>
                <div className="input-stack">
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
                    {errors.productCategory && <p className="error-message">{errors.productCategory}</p>}
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
                    {errors.productName && <p className="error-message">{errors.productName}</p>}
                  </div>
                  <div className="input-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Enter weight"
                    />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Unit of measurement <span className="required">*</span></label>
                      <select
                        name="unitOfMeasurement"
                        value={formData.unitOfMeasurement}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Enter unit of measurement</option>
                        <option value="Kgs">Kgs</option>
                        <option value="Tonnes">Tonnes</option>
                      </select>
                      {errors.unitOfMeasurement && <p className="error-message">{errors.unitOfMeasurement}</p>}
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
                      {errors.quantity && <p className="error-message">{errors.quantity}</p>}
                    </div>
                  </div>
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
                {errors.descriptionOfProducts && <p className="error-message">{errors.descriptionOfProducts}</p>}
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className={errors.submit === 'Application submitted successfully!' ? 'success-message' : 'error-message'}>
              {errors.submit}
            </p>
          )}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;