import React, { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import SampleChart from "../SampleChart";
import SampleChartThree from "../SampleChartThree";
import DashCardSet from "../DashCardSet";
import { API_URL } from "../../constants";
import DataEndpoint from "../DataEndpoint";
import DashTable from "../DashTable";
import EditModal from "../EditModal";

const AdminDashboard = ({ user }) => {
  const userUrl = `${API_URL}/users`;
  const kitsUrl = `${API_URL}/kits`;
  const kitItemsUrl = `${API_URL}/kit_items_only`;
  const donationUrl = `${API_URL}/donations`;
  const contactsUrl = `${API_URL}/contacts`;
  const kitRequestsUrl = `${API_URL}/kit_requests`;
  const [cardHeader, setCardHeader] = useState("Data Tables");
  const [record, setRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recordType, setRecordType] = useState("");
  const jwt = localStorage.getItem('jwt');
  const [messages, setMessages] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const headers = {
    userUrl: [
      { key: "id", label: "User Id" },
      { key: "email", label: "User Email" },
      { key: "name", label: "User Name" },
      { key: "role", label: "Role" },
      { key: "created_at", label: "Date Created" },
    ],
    kitsUrl: [
      { key: "id", label: "Kit Id" },
      { key: "name", label: "Kit Name" },
      { key: "description", label: "Description" },
      { key: "grade_level", label: "Grade Level" },
    ],
    kitItemsUrl: [
      { key: "id", label: "Kit Item Id" },
      { key: "name", label: "Kit Item Name" },
      { key: "description", label: "Description" },
    ],
    kitRequestsUrl: [
      { key: "id", label: "Kit Request Id" },
      { key: "request_name", label: "User Name" },
      { key: "request_email", label: "User Email" },
      { key: "requested_kit", label: "Kit Name" },
      { key: "kit_id", label: "Kit Id" },
      { key: "school_name", label: "School Name" },
      { key: "school_address", label: "School Address" },
      { key: "school_year", label: "School Year" },
      { key: "created_at", label: "Date Requested" },
    ],
    donationUrl: [
      { key: "id", label: "Donation Id" },
      { key: "donor_name", label: "Donor Name" },
      { key: "donor_email", label: "Donor Email" },
      { key: "amount", label: "Donation Amount" },
      { key: "created_at", label: "Donation Date" },
    ],
    contactsUrl: [
      { key: "name", label: "Contact Name" },
      { key: "email", label: "Contact Email" },
      { key: "phone", label: "Contact Phone" },
      { key: "message", label: "Message" },
      { key: "user_id", label: "User Id (if available)" },
    ],
  };

  const handleShow = (item, type) => {
    setRecord(item);
    setRecordType(type); // Set the type of record being edited
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setRecord(null);
    setRecordType("");
  };


  const handleDelete = async (id) => {
    let url = '';
    switch (recordType) {
      case 'user':
        url = `${API_URL}/users/${id}`;
        break;
      case 'kitItem':
        url = `${API_URL}/kit_items_only/${id}`;
        break;
      case 'kit':
        url = `${API_URL}/kits/${id}`;
        break;
      case 'donation':
        url = `${API_URL}/donations/${id}`;
        break;
      case 'kitRequest':
        url = `${API_URL}/kit_requests/${id}`;
        break;
      case 'contact':
        url = `${API_URL}/contacts/${id}`;
        break;
      default:
        console.log("Unknown record type");
        return;
    }
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
  
      if (response.ok) {
        console.log(`${recordType} with ID ${id} deleted successfully.`);
        setMessages(`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} deleted successfully.`);
        setShowModal(false);
        // Refresh data or update state as necessary
      } else {
        console.log(`Failed to delete ${recordType} with ID ${id}: ${response.statusText}`);
        setMessages(`Failed to delete ${recordType}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${recordType} with ID ${id}:`, error);
      setMessages(`An error occurred: ${error.message}`);
    }
  };
  

  const UserTable = () => (
    <DashTable
      headers={headers.userUrl}
      apiEndpoint={userUrl}
      handleShow={(item) => handleShow(item, "user")}
    />
  );
  const KitsTable = () => (
    <DashTable
      headers={headers.kitsUrl}
      apiEndpoint={kitsUrl}
      handleShow={(item) => handleShow(item, "kit")}
    />
  );
  const KitItemsTable = () => (
    <DashTable
      header={headers.kitItemsUrl}
      apiEndpoint={kitItemsUrl}
      handleShow={(item) => handleShow(item, "kitItem")}
    />
  );
  const KitRequestsTable = () => (
    <DashTable
      header={headers.kitRequestsUrl}
      apiEndpoint={kitRequestsUrl}
      handleShow={(item) => handleShow(item, "kitRequest")}
    />
  );
  const DonationsTable = () => (
    <DashTable
      header={headers.donationUrl}
      apiEndpoint={donationUrl}
      handleShow={(item) => handleShow(item, "donation")}
    />
  );
  const ContactsTable = () => (
    <DashTable
      header={headers.contactsUrl}
      apiEndpoint={contactsUrl}
      handleShow={(item) => handleShow(item, "contact")}
    />
  );

  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  useEffect(() => {
    switch (selectedEndpoint) {
      case userUrl:
        setCardHeader("User Table");
        break;
      case kitItemsUrl:
        setCardHeader("Kit Items Table");
        break;
      case kitsUrl:
        setCardHeader("Kits Table");
        break;
      case donationUrl:
        setCardHeader("Donations Table");
        break;
      case kitRequestsUrl:
        setCardHeader("Kit Requests Table");
        break;
      case contactsUrl:
        setCardHeader("Contacts Table");
        break;
      default:
        setCardHeader("Data Tables");
    }
  }, [selectedEndpoint]);
  

  if (user.role !== "admin") {
    return (
      <section className="page-section">
        <div>
          <h2>You do not have permission to view this page.</h2>
        </div>
      </section>
    );
  }
  console.log("selectedEndpoint:", selectedEndpoint);

  return (
    <>
      <nav
        className="navbar justify-content-between mt-0"
        style={{ zIndex: -1, backgroundColor: "black" }}
      >
        <div
          className="d-inline-flex w-100 justify-content-between p-0 ms-4 me-4"
          style={{ marginTop: 80 }}
        >
          
          <a className="navbar-brand text-uppercase text-white">
          <i class="bi bi-graph-up text-white me-3"></i> Admin Dashboard
          </a>
          
        </div>
      </nav>

      <button
        className="btn btn-primary mt-3 ms-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
        style={{ position: "sticky", top: 95, zIndex: 1000 }}
      >
        <i className="fas fa-bars"></i>
      </button>

      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
        style={{ width: 300 }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title mb-3" id="offcanvasExampleLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <DataEndpoint
          userUrl={userUrl}
          kitsUrl={kitsUrl}
          kitItemsUrl={kitItemsUrl}
          donationUrl={donationUrl}
          contactsUrl={contactsUrl}
          kitRequestsUrl={kitRequestsUrl}
          setSelectedEndpoint={setSelectedEndpoint}
        />
      </div>
      <main className="mt-3 pt-3" style={{ zIndex: -500 }}>
        <div className="container-fluid">
          <DashCardSet />
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-header">Kit Requests (January - July)</div>
                <div className="card-body">
                  <SampleChart />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-header">Donations (January - July)</div>
                <div className="card-body">
                  <SampleChartThree />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="card">
                <div className="card-header">{cardHeader}</div>
                <div className="card-body d-flex justify-content-center">
                  <div id="table" style={{ overflowX: "auto" }}>
                    {selectedEndpoint && (
                      <>
                        {selectedEndpoint === userUrl && (
                          <DashTable
                            headers={headers.userUrl}
                            apiEndpoint={userUrl}
                            handleShow={(item) => handleShow(item, "user")}
                          />
                        )}
                        {selectedEndpoint === kitsUrl && (
                          <DashTable
                            headers={headers.kitsUrl}
                            apiEndpoint={kitsUrl}
                            handleShow={(item) => handleShow(item, "kit")}
                          />
                        )}
                        {selectedEndpoint === kitItemsUrl && (
                          <DashTable
                            headers={headers.kitItemsUrl}
                            apiEndpoint={kitItemsUrl}
                            handleShow={(item) => handleShow(item, "kitItem")}
                          />
                        )}
                        {selectedEndpoint === kitRequestsUrl && (
                          <DashTable
                            headers={headers.kitRequestsUrl}
                            apiEndpoint={kitRequestsUrl}
                            handleShow={(item) =>
                              handleShow(item, "kitRequest")
                            }
                          />
                        )}
                        {selectedEndpoint === donationUrl && (
                          <DashTable
                            headers={headers.donationUrl}
                            apiEndpoint={donationUrl}
                            handleShow={(item) => handleShow(item, "donation")}
                          />
                        )}
                        {selectedEndpoint === contactsUrl && (
                          <DashTable
                            headers={headers.contactsUrl}
                            apiEndpoint={contactsUrl}
                            handleShow={(item) => handleShow(item, "contact")}
                          />
                        )}
                      </>
                    )}

                    {
                      selectedEndpoint === "" && (
                        <p>
                          Please select an option from the menu to view data
                        </p>
                      )
                    }
                    

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {showModal && (
            <EditModal
              record={record}
              show={showModal}
              handleClose={handleClose}
              handleDelete={handleDelete}
              recordType={recordType}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;