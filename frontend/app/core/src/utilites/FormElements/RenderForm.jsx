/* eslint-disable react-hooks/exhaustive-deps */
import {
  CancelButton,
  Card,
  Col,
  CustomCheckbox,
  CustomDatePicker,
  CustomDateRangePicker,
  CustomInput,
  CustomSelect,
  FullWidthSubmitButton,
  InlineStatusText,
  Row,
  StatusBlock,
  SubmitButton,
  Tips
} from '@ais/components';

import { mergeJson } from '@ais/utils';
import { Formik, getIn, setIn } from 'formik';
import { CircleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { removeLastPage } from '../../redux/PageHistorySlice';
import { usePage } from '../Contexts/PageContext';
import { createYupSchema } from '../YupSchemaCreator';

import { CheckBoxInput } from './CheckBoxInput';
import FileUpload from './FileUpload';
import { SwitchInput } from './SwitchInput';
import { TextInput } from './TextInput';

function RenderForm({
  formFormat,
  formData,
  callback,
  cancel = true,
  buttonLabel,
  cancelCallback,
  layout,
  children,
  blockButton,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageHistory = useSelector((state) => state.pageHistory);
  const { setCurrentPage } = usePage();

  const [formError, setFormError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  /** ------------------------------
   * 1. Handle cancel/back flow
   * ------------------------------ */
  const goBackFlow = () => {
    if (cancelCallback) return cancelCallback();

    if (pageHistory.length > 1) {
      const last = pageHistory[pageHistory.length - 2];
      dispatch(removeLastPage({}));
      setCurrentPage(last);
    } else {
      navigate(-1);
    }
  };

  /** ------------------------------
   * 2. Sanitize formData (convert null → "")
   * ------------------------------ */
  const sanitizedFormData = useMemo(() => {
    if (!formData) return {};

    const sanitizeNested = (data) => {
      if (data === null || data === undefined) return "";
      if (Array.isArray(data)) return data.map((item) => sanitizeNested(item));
      if (typeof data !== 'object') return data;

      return Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, sanitizeNested(v)])
      );
    };

    const flattenToDotPaths = (data, parent = '', acc = {}) => {
      if (data === null || data === undefined) return acc;

      if (typeof data !== 'object') {
        if (parent) acc[parent] = data;
        return acc;
      }

      Object.entries(data).forEach(([key, value]) => {
        console.log(key, value);
        const path = parent ? `${parent}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flattenToDotPaths(value, path, acc);
        } else if (Array.isArray(value)) {
          const isObjectArray = value.length > 0 && value.every(
            (item) => item && typeof item === 'object' && !Array.isArray(item)
          );

          if (isObjectArray) {
            const aggregated = {};

            value.forEach((item) => {
              const temp = {};
              flattenToDotPaths(item, path, temp);

              Object.entries(temp).forEach(([nestedPath, nestedValue]) => {
                if (nestedPath === path) return;
                if (!aggregated[nestedPath]) aggregated[nestedPath] = [];
                aggregated[nestedPath].push(nestedValue ?? "");
              });
            });

            Object.entries(aggregated).forEach(([nestedPath, nestedArray]) => {
              acc[nestedPath] = nestedArray;
            });
          }

          acc[path] = value.map((item) => (item === null || item === undefined ? "" : item));
        } else {
          acc[path] = value ?? "";
        }
      });

      return acc;
    };

    const sanitizedNested = sanitizeNested(formData);
    const flattened = flattenToDotPaths(sanitizedNested);

    return {
      ...sanitizedNested,
      ...flattened,
    };
  }, [formData]);

  /** ------------------------------
   * 3. Build Yup schema + schema initial values
   * ------------------------------ */
  const { schemaInitials, validationSchema } = useMemo(() => {
    if (!Array.isArray(formFormat)) {
      return { schemaInitials: {}, validationSchema: yup.object() };
    }

    let tempInitials = {};
    let tempSchema = {};

    const getDefaultValueByValidationType = (validationType) => {
      switch (validationType) {
        case "number":
          return 0;
        case "array":
          return [];
        case "boolean":
          return false;
        case "object":
          return {};
        default:
          return "";
      }
    };

    formFormat.forEach((section) => {
      if (!Array.isArray(section.data)) return;

      // collect initials
      section.data.forEach((item) => {
        if (item.type !== "label") {
          const defaultValue = getDefaultValueByValidationType(item.validationType);
          tempInitials = setIn(tempInitials, item.name, item.value ?? defaultValue);
        }
      });

      // collect validations
      const yupObj = section.data.reduce(createYupSchema, {});
      tempSchema = mergeJson(tempSchema, yupObj);
    });

    return {
      schemaInitials: tempInitials,
      validationSchema: yup.object().shape((tempSchema)),
    };
  }, [formFormat]);

  /** ------------------------------
   * 4. Final initialValues:
   * schema defaults → sanitized formData → final
   * ------------------------------ */
  const initialValues = useMemo(() => {

    console.log(sanitizedFormData, schemaInitials);

    return {
      ...schemaInitials,
      ...sanitizedFormData,
    };
  }, [schemaInitials, sanitizedFormData]);

  /** ------------------------------
   * 5. Component map for rendering
   * ------------------------------ */
  const fieldMap = {
    text: CustomInput,
    label: Tips,
    password: CustomInput,
    date: CustomDatePicker,
    number: CustomInput,
    color: TextInput,
    checkbox: CustomCheckbox,
    switch: SwitchInput,
    radio: CheckBoxInput,
    select: CustomSelect,
    file: FileUpload,
    boolean: SwitchInput,
    daterangepicker: CustomDateRangePicker,
  };

  /** ------------------------------
   * 6. Render individual form elements
   * ------------------------------ */
  const renderFields = (data, props, layoutCount, obj) =>
    data.map((item, idx) => {
      const Component = fieldMap[item.type];
      if (!Component) return <div key={idx} />;

      const grid = item.grid ?? 12 / (layoutCount || 1);
      const error = getIn(props.errors, item.name) ?? props.errors[item.name];
      const fieldValue = getIn(props.values, item.name) ?? props.values[item.name] ?? "";

      const { value, validations, validationType, gqlType, ...rest } = item;


      return (
        <Col
          key={idx}
          span={grid}
          lg={grid}
          md={grid}
          sm={grid}
          padding={false}
          className={`${item.className || ""} ${item.hidden ? "hidden" : ""}`}
        >
          <Component
            label={item.label}
            name={item.name}
            placeholder={item.placeholder}
            value={fieldValue}
            onChange={props.handleChange}
            error={error}
            id={item.id}
            tooltip={item.tooltip}
            type={item.type}
            data={item.data}
            disabled={item.disabled || isLoading}
            direction={obj?.direction ?? "row"}
            {...rest}
          />

          <div className="pb-4" />
        </Col>
      );
    });

  /** ------------------------------
   * 7. Final Render
   * ------------------------------ */
  return (
    <div className="form">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, actions) => {
          if (!callback) return;

          setLoading(true);
          setFormError(null);

          try {
            await callback(values, actions);
          } catch (err) {
            setFormError(err.message);
          } finally {
            setLoading(false);
          }
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            {formFormat?.map((section, index) => {
              const layoutCount = section.layout ?? 1;
              const data = section.data ?? [];

              if (!data.length) return null;

              return (
                <div className="py-4" key={index}>
                  {section.title ? (
                    <Card {...section}>
                      <Row className="py-3">
                        <Col span={12} padding={false}>
                          {formError && (
                            <StatusBlock type="error" message={formError} />
                          )}

                          <Row gap="0">
                            {renderFields(data, props, layoutCount, section)}
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ) : (
                    <Row className="p-3">
                      <Col span={12} padding={false}>
                        <Row gap="0">{renderFields(data, props, layoutCount, section)}</Row>
                      </Col>

                      {formError && (
                        <Col span="12">
                          <Row gap="1">
                            <Col span="auto" className="text-destructive">
                              <CircleAlert className="size-5" />
                            </Col>
                            <Col span="auto">
                              <InlineStatusText text={formError} variant="destructive" />
                            </Col>
                          </Row>
                        </Col>
                      )}
                    </Row>
                  )}
                </div>
              );
            })}

            {children && children(props)}

            <div className="flex-end">
              {cancel && (
                <CancelButton type="button" onClick={goBackFlow} label={`cancel`} className="px-3" />
              )}

              {blockButton ? (
                <FullWidthSubmitButton
                  type="submit"
                  label={buttonLabel || "Submit"}
                  loading={isLoading}
                />
              ) : (
                <SubmitButton
                  type="submit"
                  label={buttonLabel || "Submit"}
                  loading={isLoading}
                />
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default RenderForm;
