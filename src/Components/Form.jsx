import React from 'react';
import '../Styles/form.css';

function Form() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      businessOwner: {
        citizenship: event.target.citizenship.value,
        phoneNumber: event.target.phoneNumber.value,
        emailAddress: event.target.emailAddress.value,
        province: event.target.province.value,
      },
      business: {
        businessType: event.target.businessType.value,
        companyName: event.target.companyName.value,
        tinNumber: event.target.tinNumber.value,
        registrationDate: event.target.registrationDate.value,
        businessProvince: event.target.businessProvince.value,
      },
      product: {
        purposeOfImportation: event.target.purposeOfImportation.value,
        productCategory: event.target.productCategory.value,
        productName: event.target.productName.value,
        weight: event.target.weight.value,
        unitOfMeasurement: event.target.unitOfMeasurement.value,
        quantity: event.target.quantity.value,
        descriptionOfProducts: event.target.descriptionOfProducts.value,
      },
    };
    const subject = encodeURIComponent('RICA Import Permit Application');
    const body = encodeURIComponent(JSON.stringify(formData, null, 2));
    window.location.href = `mailto:p.touko@irembo.com?cc=${formData.businessOwner.emailAddress}&subject=${subject}&body=${body}`;
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="form-title">RICA Import Permit Application</h1>
        <form onSubmit={handleSubmit}>
          {/* Business Owner Details */}
          <div className="form-section">
            <h2 className="section-title">Business Owner Details</h2>
            <div className="input-grid">
              <div>
                <label>Applicant citizenship *</label>
                <select name="citizenship" defaultValue="" required>
                  <option value="" disabled>Select citizenship</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Foreigner">Foreigner</option>
                </select>
              </div>
              <div>
                <label>Phone number</label>
                <input type="tel" name="phoneNumber" defaultValue="+250 - 781234567" placeholder="Enter phone number" />
              </div>
              <div>
                <label>Email address</label>
                <input type="email" name="emailAddress" placeholder="Enter an email address" />
              </div>
            </div>
            <div className="input-group">
              <label>Business Owner Address</label>
              <div>
                <label>Province *</label>
                <select name="province" defaultValue="" required>
                  <option value="" disabled>Select province</option>
                  <option value="Province A">Province A</option>
                  <option value="Province B">Province B</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="form-section">
            <h2 className="section-title">Business Details</h2>
            <div className="input-grid">
              <div>
                <label>Business type *</label>
                <select name="businessType" defaultValue="" required>
                  <option value="" disabled>Select business type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>
              </div>
              <div>
                <label>Company name *</label>
                <input type="text" name="companyName" placeholder="Enter company name" required />
              </div>
              <div>
                <label>TIN number *</label>
                <input type="number" name="tinNumber" placeholder="Enter TIN number" required />
              </div>
              <div>
                <label>Registration date *</label>
                <input type="date" name="registrationDate" required />
              </div>
            </div>
            <div className="input-group">
              <label>Business Address</label>
              <div>
                <label>Province *</label>
                <select name="businessProvince" defaultValue="" required>
                  <option value="" disabled>Select province</option>
                  <option value="Province A">Province A</option>
                  <option value="Province B">Province B</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="form-section">
            <h2 className="section-title">Product Information</h2>
            <div className="input-grid">
              <div>
                <label>Purpose of importation *</label>
                <select name="purposeOfImportation" defaultValue="" required>
                  <option value="" disabled>Enter the purpose of importation</option>
                  <option value="Direct sale">Direct sale</option>
                  <option value="Personal use">Personal use</option>
                  <option value="Trial use">Trial use</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Product details</label>
              <div className="input-grid">
                <div>
                  <label>Product category *</label>
                  <select name="productCategory" defaultValue="" required>
                    <option value="" disabled>Select product category</option>
                    <option value="General purpose">General purpose</option>
                    <option value="Construction materials">Construction materials</option>
                    <option value="Chemicals">Chemicals</option>
                  </select>
                </div>
                <div>
                  <label>Product name *</label>
                  <input type="text" name="productName" placeholder="Enter product name" required />
                </div>
                <div>
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" placeholder="Weight kg" />
                </div>
                <div>
                  <label>Unit of measurement *</label>
                  <select name="unitOfMeasurement" defaultValue="" required>
                    <option value="" disabled>Select unit of measurement</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Tonnes">Tonnes</option>
                  </select>
                </div>
                <div>
                  <label>Quantity of product(s) *</label>
                  <input type="number" name="quantity" placeholder="Enter quantity of product" required />
                </div>
              </div>
              <div>
                <label>Description of products *</label>
                <textarea name="descriptionOfProducts" placeholder="Enter product description" required></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form;