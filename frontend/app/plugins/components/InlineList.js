import React, { useState, useEffect } from 'react';
import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronLeft,
  ChevronRight,
} from 'react-bootstrap-icons';

import reduceArray from 'reduceArray';
import Row from 'Row';
import Col from 'Col';

const InlineList = ({ items, callBack, allowedRoles }) => {
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [allowedRole, setAllowedRole] = useState([]);

  useEffect(() => {
    setRoleList(items);
  }, [items]);

  useEffect(() => {
    setAllowedRole(allowedRoles);
  }, [allowedRoles]);

  const moveitems = (type) => {
    if (type) {
      const leftRuleset = roleList;
      const rightRuleset = allowedRole;
      const selectedRuleSet = selectedRole;
      switch (type) {
        case 'rightFull':
          setRoleList([]);
          setAllowedRole(items);
          break;
        case 'rightSelected':
          setRoleList(reduceArray(leftRuleset, selectedRuleSet));
          setAllowedRole([...allowedRole, ...selectedRuleSet]);
          break;
        case 'leftSelected':
          setRoleList([...roleList, ...selectedRuleSet]);
          setAllowedRole(reduceArray(rightRuleset, selectedRuleSet));
          break;
        case 'leftFull':
          setRoleList(items);
          setAllowedRole([]);
          break;
      }
      setSelectedRole([]);
    }
  };

  useEffect(() => {
    if (callBack) {
      callBack(allowedRole);
    }
  }, [allowedRole]);

  return (
    <Row className={`height-300`}>
      <Col lg={5} sm={5} md={8}>
        <div className="select-block overflow-scroll height-300">
          {roleList.length > 0 &&
            roleList.map((item, index) => {
              return (
                <>
                  <div
                    className={`${
                      selectedRole.includes(item) ? 'active' : ''
                    } select-block-item`}
                    key={index}
                    onClick={() => setSelectedRole([...selectedRole, item])}
                  >
                    <span>{item}</span>
                  </div>
                </>
              );
            })}
        </div>
      </Col>
      <Col
        lg={2}
        sm={2}
        md={2}
        className={`position-relative height-100percent`}
      >
        <Row className={`height-150 position-absolute t-25`}>
          <Col className={`p-10 justify-center`}>
            <button
              type="button"
              className="btn fis-outline"
              onClick={() => moveitems('rightFull')}
            >
              <ChevronDoubleRight size={20} />
            </button>
          </Col>

          <Col className={`p-10 justify-center`}>
            <button
              type="button"
              className="btn fis-outline"
              onClick={() => moveitems('rightSelected')}
            >
              <ChevronRight size={20} />
            </button>
          </Col>

          <Col className={`p-10 justify-center`}>
            <button
              type="button"
              className="btn fis-outline"
              onClick={() => moveitems('leftSelected')}
            >
              <ChevronLeft size={20} />
            </button>
          </Col>

          <Col className={`p-10 justify-center`}>
            <button
              type="button"
              className="btn fis-outline"
              onClick={() => moveitems('leftFull')}
            >
              <ChevronDoubleLeft size={20} />
            </button>
          </Col>
        </Row>
      </Col>

      <Col lg={5} md={5} sm={5}>
        <div className="select-block overflow-scroll height-300">
          {allowedRole.length > 0 &&
            allowedRole.map((item, index) => {
              return (
                <>
                  <div
                    className={`${
                      selectedRole.includes(item) ? 'active' : ''
                    } select-block-item`}
                    key={index}
                    onClick={() => setSelectedRole([...selectedRole, item])}
                  >
                    <span>{item}</span>
                  </div>
                </>
              );
            })}
        </div>
      </Col>
    </Row>
  );
};

export default InlineList;
