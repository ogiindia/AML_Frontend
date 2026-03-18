import { groupJsonByKey } from '@ais/utils';
import { Fingerprint, Lock, LogOut, Rocket, ShieldCheck, User } from 'lucide-react';
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLineSeparator,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage
} from '../components/ui/breadcrumb';
import { Col } from '../components/ui/Col';
import { Row } from '../components/ui/Row';
import { Separator } from '../components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar';
import { SideBar } from '../elements/SideBars';

declare global {
  interface Window {
    __BRANDING_CONFIG__?: {
      launcher?: boolean;
      [key: string]: any;
    };
    __CONTEXT_PATH__?: string;
  }
}

const sampleData = [
  {
    id: '38eab44c-c5e9-4359-b699-c02c986eb642',
    createdAt: [2024, 12, 6, 11, 29, 38, 51035000],
    updatedAt: [2024, 12, 6, 11, 29, 38, 51035000],
    entityName: 'dashboard',
    tid: '1000',
    isMenu: true,
    module: 'Back Office',
    'menu.id': 'b0df0e07-6109-4177-b943-069607721dda',
    'menu.createdAt': [2024, 12, 6, 11, 29, 38, 71171000],
    'menu.updatedAt': [2024, 12, 6, 11, 29, 38, 71171000],
    'menu.menuName': 'dashboard',
    'menu.sid': '1',
    'menu.path': '/dashboard',
    'menu.page': 'dashboard',
    'menu.subMenu': false,
    'menu.showInMenu': true,
    'menu.icons': 'bar-chart',
    'menu.menuOrder': 1,
    children: [],
  },
  {
    id: '97a1b2c7-864f-40e1-8249-21f2b393f74a',
    createdAt: [2024, 12, 6, 11, 30, 29, 718670000],
    updatedAt: [2024, 12, 6, 11, 30, 29, 718670000],
    entityName: 'entity hub',
    tid: '1100',
    isMenu: true,
    module: 'Back Office',
    'menu.id': '19563003-0b24-400e-a09e-96a845becbec',
    'menu.createdAt': [2024, 12, 6, 11, 30, 29, 718670000],
    'menu.updatedAt': [2024, 12, 6, 11, 30, 29, 718670000],
    'menu.menuName': 'Entity Hub',
    'menu.sid': '1',
    'menu.subMenu': false,
    'menu.showInMenu': true,
    'menu.icons': 'person',
    'menu.menuOrder': 2,
    children: [
      {
        id: '618e24a7-883d-4f08-841f-ea2586a53807',
        updatedAt: [2024, 12, 18, 16, 51, 39, 213052000],
        entityName: 'Institutions List',
        tid: '1105',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '493796c7-5223-4479-a602-fdf99e82dce2',
        'menu.createdAt': [2024, 12, 18, 16, 51, 39, 208004000],
        'menu.updatedAt': [2024, 12, 18, 16, 51, 39, 208004000],
        'menu.menuName': 'Institutions',
        'menu.path': '/entity/institutions/list',
        'menu.page': 'v2-institutions-list',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.module': 'Back Office',
        'menu.showInMenu': true,
        'menu.icons': 'bank',
        'menu.menuOrder': 1,
        children: [],
      },
      {
        id: 'ce8b9ab3-e256-48ce-914d-30452b1722e1',
        updatedAt: [2024, 12, 18, 16, 55, 1, 228200000],
        entityName: 'List Divisions',
        tid: '1110',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '602f7888-48f1-4be1-b94f-405ecdb161e4',
        'menu.createdAt': [2024, 12, 18, 16, 55, 1, 228200000],
        'menu.updatedAt': [2024, 12, 18, 16, 55, 1, 228200000],
        'menu.menuName': 'Divisions',
        'menu.path': '/entity/divisions/list',
        'menu.page': 'v2-divisions-list',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.module': 'Back Office',
        'menu.showInMenu': true,
        'menu.icons': 'broadcast',
        'menu.menuOrder': 2,
        children: [],
      },
      {
        id: 'bfb9c451-c4c3-4a69-89b6-dc403db9e245',
        createdAt: [2024, 12, 6, 11, 31, 9, 435222000],
        updatedAt: [2024, 12, 6, 11, 31, 9, 435222000],
        entityName: 'List Users',
        tid: '1101',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '26c45767-7899-4d8a-9d15-e909b58d659b',
        'menu.createdAt': [2024, 12, 6, 11, 31, 9, 435222000],
        'menu.updatedAt': [2024, 12, 6, 11, 31, 9, 435222000],
        'menu.menuName': 'Users',
        'menu.sid': '1',
        'menu.path': '/entity/users/list',
        'menu.page': 'v2-users-list',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': true,
        'menu.icons': 'person',
        'menu.menuOrder': 3,
        children: [],
      },
      {
        id: 'f25c5b23-a329-4c10-892a-cd3a37e595fe',
        updatedAt: [2024, 12, 23, 18, 10, 5, 404198000],
        entityName: 'View Events',
        tid: '1120',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'a40c387c-0e07-4dbe-ae35-2cd6dec593db',
        'menu.updatedAt': [2024, 12, 23, 18, 10, 5, 404706000],
        'menu.menuName': 'List Events',
        'menu.path': '/entity/events/list',
        'menu.page': 'v2-events-list',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.module': 'Back Office',
        'menu.showInMenu': true,
        'menu.icons': 'calendar-event',
        'menu.menuOrder': 3,
        children: [],
      },
      {
        id: 'fc4b4aac-b86e-4968-8864-11c234d7ebed',
        createdAt: [2024, 12, 6, 13, 38, 13, 18685000],
        updatedAt: [2024, 12, 6, 13, 38, 13, 18685000],
        entityName: 'Create User',
        tid: '1102',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'b3f162da-c932-45df-8c85-9afce1d193d9',
        'menu.createdAt': [2024, 12, 6, 13, 38, 13, 18685000],
        'menu.updatedAt': [2024, 12, 6, 13, 38, 13, 18685000],
        'menu.menuName': 'create user',
        'menu.sid': '2',
        'menu.path': '/entity/users/create',
        'menu.page': 'v2-users-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 4,
        children: [],
      },
      {
        id: '7185b691-2576-4b59-81d1-a1851f9fa106',
        updatedAt: [2024, 12, 23, 9, 21, 10, 382343000],
        entityName: 'List Group',
        tid: '1115',
        isMenu: false,
        module: 'Back Office',
        'menu.id': '3e0159b2-ffd1-4ff0-8b7f-ceb73687ed5e',
        'menu.updatedAt': [2024, 12, 23, 9, 21, 10, 382343000],
        'menu.menuName': 'Groups',
        'menu.path': '/entity/groups/list',
        'menu.page': 'v2-groups-list',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.module': 'Back Office',
        'menu.showInMenu': false,
        'menu.icons': 'people',
        'menu.menuOrder': 4,
        children: [],
      },
      {
        id: 'b24c6a3f-eab2-406f-b487-82f90775de1f',
        createdAt: [2024, 12, 23, 18, 9, 43, 766079000],
        updatedAt: [2024, 12, 23, 18, 9, 43, 766079000],
        entityName: 'Create Event',
        tid: '1121',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'eaf0a356-aa2f-475b-97fe-b35b4057cdc6',
        'menu.createdAt': [2024, 12, 23, 18, 9, 43, 766079000],
        'menu.updatedAt': [2024, 12, 23, 18, 9, 43, 766079000],
        'menu.menuName': 'Create Event',
        'menu.path': '/entity/events/create',
        'menu.page': 'v2-events-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.module': 'Back Office',
        'menu.menuOrder': 4,
        children: [],
      },
      {
        id: 'a3834178-e9b3-47f2-85d0-9d697366605c',
        createdAt: [2024, 12, 7, 9, 48, 43, 348262000],
        updatedAt: [2024, 12, 7, 9, 48, 43, 348262000],
        entityName: 'Customer View',
        tid: '1123',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'a3834178-e9b3-47f2-85d0-9d697366605c',
        'menu.createdAt': [2024, 12, 7, 9, 48, 43, 366398000],
        'menu.updatedAt': [2024, 12, 7, 9, 48, 43, 366398000],
        'menu.menuName': 'Customer view',
        'menu.sid': '3',
        'menu.path': '/entity/customers/view',
        'menu.page': 'v2-customers-view',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 5,
        children: [],
      },
      {
        id: '3b094642-11ef-4374-a923-90f58b60dd1a',
        createdAt: [2024, 12, 7, 9, 48, 43, 348262000],
        updatedAt: [2024, 12, 7, 9, 48, 43, 348262000],
        entityName: 'Edit User',
        tid: '1103',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '1f1ae667-1d69-411e-a905-cefd49c23b22',
        'menu.createdAt': [2024, 12, 7, 9, 48, 43, 366398000],
        'menu.updatedAt': [2024, 12, 7, 9, 48, 43, 366398000],
        'menu.menuName': 'edit user',
        'menu.sid': '3',
        'menu.path': '/entity/users/create',
        'menu.page': 'v2-users-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 5,
        children: [],
      },
      {
        id: 'a12745d8-7e8f-4484-b2da-f997ac9e43f8',
        createdAt: [2024, 12, 7, 9, 49, 14, 270188000],
        updatedAt: [2024, 12, 7, 9, 49, 14, 270188000],
        entityName: 'Delete User',
        tid: '1104',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'a3834178-e9b3-47f2-85d0-9d697366604c',
        'menu.createdAt': [2024, 12, 7, 9, 49, 14, 270188000],
        'menu.updatedAt': [2024, 12, 7, 9, 49, 14, 270188000],
        'menu.menuName': 'delete user',
        'menu.sid': '4',
        'menu.path': '/entity/users/delete',
        'menu.page': 'v2-users-delete',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 6,
        children: [],
      },
      {
        id: 'd4ade6b0-97a0-4f88-9c28-ea16a18132d7',
        createdAt: [2024, 12, 23, 18, 23, 45, 208147000],
        updatedAt: [2024, 12, 23, 18, 23, 45, 208147000],
        entityName: 'Customer Search',
        tid: '1122',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '5b79e1c1-9eef-48c8-8e7f-1798e5bba5f5',
        'menu.createdAt': [2024, 12, 23, 18, 23, 45, 208147000],
        'menu.updatedAt': [2024, 12, 23, 18, 23, 45, 208147000],
        'menu.menuName': 'Customer Search',
        'menu.sid': '5',
        'menu.path': '/entity/customers/search',
        'menu.page': 'v2-customers-search',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': true,
        'menu.icons': 'person',
        'menu.menuOrder': 7,
        children: [],
      },
      {
        id: '331d3ccd-6830-4163-9fe8-f039748dc19d',
        createdAt: [2024, 12, 7, 9, 51, 17, 351941000],
        updatedAt: [2024, 12, 7, 9, 51, 17, 351941000],
        entityName: 'Create Institutions',
        tid: '1106',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '071a46be-0bf9-4ced-a8bb-51c8aa3e7b20',
        'menu.createdAt': [2024, 12, 7, 9, 51, 17, 351941000],
        'menu.updatedAt': [2024, 12, 7, 9, 51, 17, 351941000],
        'menu.menuName': 'create institutions',
        'menu.sid': '6',
        'menu.path': '/entity/institutions/create',
        'menu.page': 'v2-institutions-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 8,
        children: [],
      },
      {
        id: '06f14f3a-a93a-4255-8590-254498eb8031',
        createdAt: [2024, 12, 7, 9, 51, 48, 265136000],
        updatedAt: [2024, 12, 7, 9, 51, 48, 265136000],
        entityName: 'Edit Institutions',
        tid: '1107',
        isMenu: true,
        module: 'Back Office',
        'menu.id': 'e8b4c910-ee66-41e3-9444-1ca6af9f8f52',
        'menu.createdAt': [2024, 12, 7, 9, 51, 48, 265136000],
        'menu.updatedAt': [2024, 12, 7, 9, 51, 48, 265136000],
        'menu.menuName': 'edit institutions',
        'menu.sid': '6',
        'menu.path': '/entity/institutions/edit',
        'menu.page': 'v2-institutions-edit',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 9,
        children: [],
      },
      {
        id: 'b591aa75-b814-43c0-b09b-bc9f38c1e87b',
        createdAt: [2024, 12, 7, 9, 52, 8, 669141000],
        updatedAt: [2024, 12, 7, 9, 52, 8, 669141000],
        entityName: 'Delete Institutions',
        tid: '1108',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '01ab5b41-d4eb-4412-ba9f-177b19c02393',
        'menu.createdAt': [2024, 12, 7, 9, 52, 8, 669141000],
        'menu.updatedAt': [2024, 12, 7, 9, 52, 8, 669141000],
        'menu.menuName': 'Delete institutions',
        'menu.sid': '7',
        'menu.path': '/entity/institutions/delete',
        'menu.page': 'v2-institutions-delete',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 10,
        children: [],
      },
      {
        id: '39380c15-91db-4112-ae20-959f70c44d68',
        createdAt: [2024, 12, 7, 10, 5, 5, 5321000],
        updatedAt: [2024, 12, 7, 10, 5, 5, 5321000],
        entityName: 'Create Divisions',
        tid: '1111',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '493d8810-90f7-4f6c-bc7e-bafb393f1418',
        'menu.createdAt': [2024, 12, 7, 10, 5, 5, 6360000],
        'menu.updatedAt': [2024, 12, 7, 10, 5, 5, 6360000],
        'menu.menuName': 'Create Divisions',
        'menu.sid': '9',
        'menu.path': '/entity/divisions/create',
        'menu.page': 'v2-divisions-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 12,
        children: [],
      },
      {
        id: '333c3038-fa01-4de8-bcc9-50c9fce2a914',
        createdAt: [2024, 12, 7, 10, 5, 26, 72676000],
        updatedAt: [2024, 12, 7, 10, 5, 26, 72676000],
        entityName: 'Edit Divisions',
        tid: '1112',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '330cce37-6eda-4a4b-a4ff-85e6bf6870fb',
        'menu.createdAt': [2024, 12, 7, 10, 5, 26, 72676000],
        'menu.updatedAt': [2024, 12, 7, 10, 5, 26, 72676000],
        'menu.menuName': 'Edit Divisions',
        'menu.sid': '10',
        'menu.path': '/entity/divisions/edit',
        'menu.page': 'v2-divisions-edit',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 13,
        children: [],
      },
      {
        id: 'adb1299e-baef-4c67-96ea-750322ed94ab',
        createdAt: [2024, 12, 7, 10, 5, 50, 407225000],
        updatedAt: [2024, 12, 7, 10, 5, 50, 407225000],
        entityName: 'Delete Divisions',
        tid: '1113',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '18423e5a-00e0-483d-9042-42062f0e3cf3',
        'menu.createdAt': [2024, 12, 7, 10, 5, 50, 407225000],
        'menu.updatedAt': [2024, 12, 7, 10, 5, 50, 407225000],
        'menu.menuName': 'Delete Divisions',
        'menu.sid': '11',
        'menu.path': '/entity/divisions/delete',
        'menu.page': 'v2-divisions-delete',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 14,
        children: [],
      },
      {
        id: '9d318844-8340-4333-b11e-cce8fb4c71fb',
        createdAt: [2024, 12, 7, 10, 22, 7, 950060000],
        updatedAt: [2024, 12, 7, 10, 22, 7, 950060000],
        entityName: 'Edit Group',
        tid: '1117',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '69e46f25-17e4-46a0-b628-27b691ffb875',
        'menu.createdAt': [2024, 12, 7, 10, 22, 7, 951255000],
        'menu.updatedAt': [2024, 12, 7, 10, 22, 7, 951255000],
        'menu.menuName': 'edit Groups',
        'menu.sid': '14',
        'menu.path': '/entity/groups/edit',
        'menu.page': 'v2-groups-edit',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 16,
        children: [],
      },
      {
        id: 'fd5bced1-674f-4dec-8aea-6b442633280e',
        createdAt: [2024, 12, 7, 10, 22, 30, 469191000],
        updatedAt: [2024, 12, 7, 10, 22, 30, 469191000],
        entityName: 'Delete Group',
        tid: '1118',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '062bbd74-6f85-4e6c-8347-61964c1a6cd3',
        'menu.createdAt': [2024, 12, 7, 10, 22, 30, 469191000],
        'menu.updatedAt': [2024, 12, 7, 10, 22, 30, 469191000],
        'menu.menuName': 'Delete Groups',
        'menu.sid': '15',
        'menu.path': '/entity/groups/delete',
        'menu.page': 'v2-groups-delete',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 17,
        children: [],
      },
      {
        id: '1c0a6a33-daa2-4a89-b0d3-fa9f26b8119e',
        createdAt: [2024, 12, 7, 10, 21, 48, 40827000],
        updatedAt: [2024, 12, 7, 10, 21, 48, 40827000],
        entityName: 'Create Group',
        tid: '1116',
        isMenu: true,
        module: 'Back Office',
        'menu.id': '80bbb185-3ad1-4e37-9e0d-77f0657c3f6e',
        'menu.createdAt': [2024, 12, 7, 10, 21, 48, 40827000],
        'menu.updatedAt': [2024, 12, 7, 10, 21, 48, 40827000],
        'menu.menuName': 'Create Groups',
        'menu.sid': '13',
        'menu.path': '/entity/groups/create',
        'menu.page': 'v2-groups-create',
        'menu.subMenu': true,
        'menu.parentMenuID': '1100',
        'menu.showInMenu': false,
        'menu.menuOrder': 18,
        children: [],
      },
    ],
  },
  {
    id: 'aeb49df4-434f-4583-a79f-0c8dde506276',
    updatedAt: [2024, 12, 18, 17, 8, 29, 742285000],
    entityName: 'Access Policies',
    tid: '1400',
    isMenu: true,
    module: 'Back Office',
    'menu.id': '13babdf5-cf61-4738-9e11-d408ef693c62',
    'menu.createdAt': [2024, 12, 18, 17, 8, 29, 742285000],
    'menu.updatedAt': [2024, 12, 18, 17, 8, 29, 742285000],
    'menu.menuName': 'Policy Manager',
    'menu.path': '/policy/manager',
    'menu.page': 'v2-policy-list',
    'menu.subMenu': false,
    'menu.module': 'Back Office',
    'menu.showInMenu': true,
    'menu.icons': 'alt',
    'menu.menuOrder': 4,
    children: [],
  },
  {
    id: 'f1b1d243-6a4a-42d3-aad3-4038fa093b64',
    updatedAt: [2024, 12, 18, 20, 15, 31, 639816000],
    entityName: 'configurations',
    tid: '1300',
    isMenu: true,
    module: 'Back Office',
    'menu.id': '1b17762c-8f65-4f92-8ba0-abfa38c9da1c',
    'menu.updatedAt': [2024, 12, 18, 20, 15, 31, 639816000],
    'menu.menuName': 'Configurations',
    'menu.path': '/configurations',
    'menu.page': 'v2-configurations-load',
    'menu.subMenu': false,
    'menu.module': 'Back Office',
    'menu.showInMenu': true,
    'menu.icons': 'gear',
    'menu.menuOrder': 8,
    children: [],
  },
  {
    id: '2add10f7-01e3-4cda-bc5a-20f7845226d2',
    updatedAt: [2024, 12, 23, 9, 17, 53, 366971000],
    entityName: 'Reports',
    tid: '1200',
    isMenu: true,
    module: 'Back Office',
    'menu.id': '2b292796-f6b4-4823-b362-27870b213df8',
    'menu.updatedAt': [2024, 12, 23, 9, 17, 53, 366971000],
    'menu.menuName': 'Reports',
    'menu.path': '/reports',
    'menu.page': 'v2-reports',
    'menu.subMenu': false,
    'menu.module': 'Back Office',
    'menu.showInMenu': true,
    'menu.icons': 'list',
    'menu.menuOrder': 19,
    children: [],
  },
];

const staticModules = [
  {
    name: 'AML',
    plan: 'FINSEC',
    url: '#',
    logo: ShieldCheck,
    icon: 'Lock',
  },
  {
    name: 'AIS',
    plan: 'Back-Office',
    url: '#',
    logo: Fingerprint,
    icon: 'Fingerprint',
  },
  {
    name: 'CCSS',
    plan: 'Reporting',
    url: '#',
    logo: Lock,
    icon: 'Lock',
  },
  {
    name: 'User Managment',
    plan: 'UAM',
    url: '#',
    logo: User,
    icon: 'User',
  },
];

export function SideBarLayout({
  menuData,
  callback,
  children,
  padding = true,
  modules,
  username,
  groupName,
}: {
  menuData: {};
  callback: (e) => void;
  children?: React.ReactNode;
  padding?: boolean;
  modules?: [];
  username?: string;
  groupName?: string;
}) {
  const [launcherEnabled, setLauncherEnabled] = React.useState(false);
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
    // Read branding launcher flag from global config
    if (typeof window !== 'undefined' && window.__BRANDING_CONFIG__) {
      setLauncherEnabled(window.__BRANDING_CONFIG__.launcher === true);
    }
  }, []);

  const handleLauncher = () => {
    if (typeof window !== 'undefined') {
      // const contextPath = window.__CONTEXT_PATH__ || '';
      callback('/launcher');
    }
  };


  const handleLogout = () => {
    callback('/logout');
  };
  return (
    <SidebarProvider>
      <SideBar
        menuData={groupJsonByKey(menuData, 'app.appName')}
        switcherData={modules ?? staticModules}
        callback={callback}
        username={username}
        groupName={groupName}
      />
      {/* <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="relative z-50">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <SidebarMenuButton className="w-full">
                    Select Workspace
                    <ChevronDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Acme Corp.</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage href="#">
                    FINSEC
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbLineSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink> Enhanced Solution for Anti Money Laundering</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Launcher and Logout buttons */}
          <div className="flex items-center gap-2 px-4">
            {isBrowser && launcherEnabled && (
              <button
                onClick={handleLauncher}
                title="Application Launcher"
                className="p-2 hover:bg-accent rounded-md transition-colors cursor-pointer"
              >
                <Rocket size={18} />
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 hover:bg-accent rounded-md transition-colors cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <Row gap={'2'}>
          <Col padding={false}>{children}</Col>
        </Row>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
