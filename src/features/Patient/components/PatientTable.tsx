import { Table } from 'antd';
import React from 'react';

const columns = [
  {
    title: 'Patient ID',
    dataIndex: ['resource', 'id'],
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: ['resource', 'name', 0, 'text'],
    key: 'name',
  },
  {
    title: 'Identifier',
    dataIndex: ['resource', 'identifier', 0, 'value'],
    key: 'identifier',
  },
  {
    title: 'Gender',
    dataIndex: ['resource', 'gender'],
    key: 'gender',
  },
  {
    title: 'Birth Date',
    dataIndex: ['resource', 'birthDate'],
    key: 'birthDate',
  },
  {
    title: 'Phone',
    key: 'phone',
    render: (_: any, record: any) => {
      const phone = record.resource.telecom.find(
        (t: any) => t.system === 'phone',
      );
      return phone?.value || '—';
    },
  },
  {
    title: 'Email',
    key: 'email',
    render: (_: any, record: any) => {
      const email = record.resource.telecom.find(
        (t: any) => t.system === 'email',
      );
      return email?.value || '—';
    },
  },
  {
    title: 'Address',
    key: 'address',
    render: (_: any, record: any) => {
      const addr = record.resource.address[0];
      return addr ? `${addr.line.join(', ')}, ${addr.postalCode}` : '—';
    },
  },
  {
    title: 'Last Updated',
    dataIndex: ['resource', 'meta', 'lastUpdated'],
    key: 'lastUpdated',
  },
];

const data = [
  {
    fullUrl:
      'http://fhirapi.healthx.sg/Patient/3A7D84520EE64DEB950A79524094EE7C',
    resource: {
      resourceType: 'Patient',
      id: '3A7D84520EE64DEB950A79524094EE7C',
      meta: {
        versionId: '1',
        lastUpdated: '2025-06-11T09:55:32.823+08:00',
      },
      identifier: [
        {
          value: 'S1234567D',
        },
      ],
      name: [
        {
          use: 'official',
          text: 'Lim Ah Seng',
          family: 'Lim',
          prefix: ['Mr'],
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '98765432',
          use: 'mobile',
        },
        {
          system: 'email',
          value: 'myinfotesting@gmail.com',
        },
      ],
      gender: 'male',
      birthDate: '2000-01-01',
      address: [
        {
          use: 'home',
          line: [
            '6',
            'Serangoon North Avenue 5',
            '05',
            '11',
            'MapleTree',
            'SG',
          ],
          postalCode: '554910',
          country: 'Singapore',
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'http://fhirapi.healthx.sg/Patient/6349F3F7D3CD4BBF86D3D0294A7E0E72',
    resource: {
      resourceType: 'Patient',
      id: '6349F3F7D3CD4BBF86D3D0294A7E0E72',
      meta: {
        versionId: '1',
        lastUpdated: '2025-07-01T14:03:24.614+08:00',
      },
      identifier: [
        {
          value: 'S1234568D',
        },
      ],
      name: [
        {
          use: 'official',
          text: 'Jonathan Joestar',
          family: 'Joestar',
          prefix: ['Mr'],
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '88889999',
          use: 'mobile',
        },
        {
          system: 'email',
          value: 'jonathanj888@gmail.com',
        },
      ],
      gender: 'male',
      birthDate: '1968-02-12',
      address: [
        {
          use: 'home',
          line: ['1 North', 'Buona Vista Link', '05', '01', 'Elementum', 'SG'],
          postalCode: '139691',
          country: 'Singapore',
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
];

const PatientTable: React.FC = () => {
  return <Table columns={columns} dataSource={data} />;
};

export default PatientTable;
