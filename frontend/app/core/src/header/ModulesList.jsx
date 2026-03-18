import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

function ModulesList({
  selectedModule = 'Back Office',
  headerMenu,
  valueSelect,
}) {
  const [isOpen, setisOpen] = useState();

  const toggleDropdown = (isOpen) => {
    setisOpen(isOpen);
  };

  return (
    <>
      <Dropdown
        show={isOpen}
        onToggle={toggleDropdown}
        id="dropdown-basic-button"
      >
        <Dropdown.Toggle variant="primary" id="dropdown-toggle">
          {selectedModule}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {Object.keys(headerMenu).map((key, i) => {
            return (
              <>
                <Dropdown.Item
                  key={i}
                  onClick={() => valueSelect(key)}
                  className={`modules-menu-link 
                                }`}
                  href="#"
                >
                  {headerMenu[key]}
                </Dropdown.Item>
              </>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default ModulesList;
