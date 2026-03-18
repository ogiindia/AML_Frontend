import * as aisAPI from '@ais/api';
import { api } from '@ais/api';
import * as components from '@ais/components';
import {
  Card,
  CollapsibleText,
  Divider,
  Heading,
  InlineLoadingComponent,
  LoadingComponent,
  Protected,
  SimpleModal,
} from '@ais/components';
import * as datatable from '@ais/datatable';
import * as AISgraphql from '@ais/graphql';
import {
  generateDeleteQuery,
  generateQueryFromFormJson,
} from '@ais/graphql/BuildGPLQuery';
import * as utils from '@ais/utils';
import { Steps, Timeline } from 'antd';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import * as formik from 'formik';
import moment from 'moment';
import * as React from 'react';
import * as reactBootstrap from 'react-bootstrap';
import * as reactIcons from 'react-bootstrap-icons';
import * as ChartJs from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import Tree from 'react-d3-tree';
import * as ReactRouter from 'react-router';
import * as yup from 'yup';
import DynamicComponent from '../components/DynamicComponent';
import { dateFormats } from '../config';
import CurdLayout from '../pages/Template/CurdLayout';
import ListLayout from '../pages/Template/ListLayout';
import useRoleBasedNavigate from '../router/useRoleBasedNavigate';
import { useGlobalContext } from './Contexts/GlobalContext';
import { useModalHost } from './Contexts/ModalHostContext';
import { usePage } from './Contexts/PageContext';
import { WithSession } from './Contexts/WithSession';
import RenderFlow from './FlowElements/RenderFlow';
import BackButton from './FormElements/BackButton';
import { CheckBoxInput } from './FormElements/CheckBoxInput';
import CustomForm from './FormElements/CustomForm';
import { LabelComponent } from './FormElements/LabelComponent';
import RenderForm from './FormElements/RenderForm';
import { SelectInput } from './FormElements/SelectInput';
import { TextInput } from './FormElements/TextInput';

const Packages = {
  react: () => React,
  'react-bootstrap-icons': () => reactIcons,
  'react-bootstrap': () => reactBootstrap,
  Steps: () => Steps,
  Divider: () => Divider,
  useGlobalContext: () => useGlobalContext,
  RenderForm: () => RenderForm,
  TextBox: () => TextInput,
  LabelBox: () => LabelComponent,
  CheckBox: () => CheckBoxInput,
  SelectBox: () => SelectInput,
  BackButton: () => BackButton,
  '@ais/components': () => components,
  '@ais/utils': () => utils,
  Loading: () => LoadingComponent,
  Modal: () => SimpleModal,
  'react-router': () => ReactRouter,
  usePageContext: () => usePage,
  api: () => api,
  '@ais/api': () => aisAPI,
  Card: () => Card,
  CollapsibleText: () => CollapsibleText,
  Heading: () => Heading,
  CustomForm: () => CustomForm,
  yup: () => yup,
  '@ais/datatable': () => datatable,
  RenderFlow: () => RenderFlow,
  ListLayout: () => ListLayout,
  CurdLayout: () => CurdLayout,
  Tree: () => Tree,
  Doughnut: () => Doughnut,
  ChartJs: () => ChartJs,
  Chart: () => Chart,
  CategoryScale: () => CategoryScale,
  Timeline: () => Timeline,
  WithSession: () => WithSession,
  useRoleBasedNavigate: () => useRoleBasedNavigate,
  Protected: () => Protected,
  '@ais/graphql': () => AISgraphql,
  generateQueryFromFormJson: () => generateQueryFromFormJson,
  generateDeleteQuery: () => generateDeleteQuery,
  RemoteComponent: () => DynamicComponent,
  formik: () => formik,
  InlineLoadingComponent: () => InlineLoadingComponent,
  dateFormats: () => dateFormats,
  moment: () => moment,
  useModalHost: () => useModalHost
};

const fromPairs = (pairs) =>
  Object.assign({}, ...pairs.map(([k, v]) => ({ [k]: v })));
const AllPackages = fromPairs(
  Object.keys(Packages).map((k) => [k, () => ({ exports: Packages[k]() })]),
);

export default AllPackages;
