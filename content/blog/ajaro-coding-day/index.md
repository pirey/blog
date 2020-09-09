---
title: Ajaro Coding Day
date: 2019-07-04 21:43:28
tags:
---

## npm vs yarn

boleh pakai mana saja.

tapi untuk menghindari conflict, pakai salah satu, misalnya install package `reactstrap` pakai `npm`, maka selanjutnya pakai `npm` terus. begitu juga sebaliknya, jika install pakai `yarn`, maka selanjutnya pakai `yarn` terus.

## create react app

```
npm i -g create-react-app
create-react-app <folder>
cd <folder>
npm start
```

## basic routing

install router

```
npm i -S react-router-dom
```

edit `src/App.js`

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoginPage from './auth/LoginPage';
import ProtectedPage from './ProtectedPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={ProtectedPage} />
      </Switch>
    </Router>
  );
}

export default App;
```

buat 2 file baru:
- `src/auth/LoginPage.js`

```javascript
import React from 'react';

function LoginPage() {
  return <div>Login</div>;
}

export default LoginPage;
```

- `src/ProtectedPage.js`

```javascript
import React from 'react';

function ProtectedPage() {
  return <div>Protected</div>;
}

export default ProtectedPage;
```
## tampilan halaman login & bootstrap

### install bootstrap

```
npm i -S bootstrap reactstrap
```

tambahkan di `src/index.js`

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### form login

edit `src/auth/LoginPage.js`

```javascript

import React, { useState } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

function LoginPage(props) {
  const { history } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = e => setEmail(e.target.value);
  const handleChangePassword = e => setPassword(e.target.value);
  const handleLogin = e => {
    e.preventDefault();

    // TODO call api

    history.push('/');
  };

  return (
    <Container>
      <Row>
        <Col
          sm={{
            size: 6,
            offset: 3
          }}
        >
          <h2 className="mt-5 mb-3">Login</h2>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={handleChangeEmail}
                type="email"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                value={password}
                onChange={handleChangePassword}
                type="password"
                required
              />
            </FormGroup>
            <Button color="primary">Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;

```

## autentikasi / cek token

edit `src/ProtectedPage.js`

```javascript
import React, { useEffect } from 'react';
import { getToken } from './utils';

function ProtectedPage(props) {
  const { history } = props;
  useEffect(() => {
    const token = getToken();
    if (!token) {
      history.push('/login');
    }
  });

  return <div>Protected</div>;
}

export default ProtectedPage;
```

buat file baru untuk mengelola token `src/utils.js`

```javascript
export function clearToken() {
  window.localStorage.removeItem('token');
}
export function saveToken(token) {
  window.localStorage.setItem('token', token);
}
export function getToken() {
  return window.localStorage.getItem('token');
}
```

## proses login dengan api

### config

buat file config `.env`

```
touch .env
```

tambah config

```
REACT_APP_BASE_API_URL=http://localhost:8000/api/v1
```

restart server

```
# Control+C

npm start
```

### install axios

```
npm i -S axios
```

### api login

buat file baru `src/auth/api.js`

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function login(payload) {
  const { email, password } = payload;

  return axios({
    method: 'POST',
    url: `${baseUrl}/login`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: { email, password }
  })
}
```

### memanggil api login

edit `src/auth/LoginPage.js` tambahkan proses pemanggilan api saat submit form

```javascript
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import toast from 'toasted-notes';

import { login } from './api';
import { saveToken } from '../utils';

function LoginPage(props) {
  const { history } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = e => setEmail(e.target.value);
  const handleChangePassword = e => setPassword(e.target.value);
  const handleLogin = e => {
    e.preventDefault();

    const payload = { email, password };
    login(payload)
      .then(response => {
        const token = response.data.api_token;
        saveToken(token);
        history.push('/');
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Login gagal';

        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ))
      });
  };

  return (
    <Container>
      <Row>
        <Col
          sm={{
            size: 6,
            offset: 3
          }}
        >
          <h2 className="mt-5 mb-3">Login</h2>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={handleChangeEmail}
                type="email"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                value={password}
                onChange={handleChangePassword}
                type="password"
                required
              />
            </FormGroup>
            <Button color="primary">Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
```

install `toasted-notes` untuk menampilkan pesan.

```
npm i -S toasted-notes
```

tambahkan `toasted-notes` css di `src/index.js`

```javascript
import 'toasted-notes/src/styles.css';
```

## Layout

buat file baru `src/Layout.js`

```javascript
import React from 'react';
import { clearToken, getToken } from './utils';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { logout } from './auth/api';

function Layout(props) {
  const { children, history } = props;
  const handleLogout = () => {
    const token = getToken();

    clearToken();
    logout(token)
      .finally(() => {
        history.push('/login');
      })
  };

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={3} className="mb-3">
          <ListGroup>
            <ListGroupItem tag={Link} to="/" action>
              Dashboard
            </ListGroupItem>
            <ListGroupItem tag={Link} to="/sales" action>
              Penjualan
            </ListGroupItem>
            <ListGroupItem tag={Link} to="/purchases" action>
              Pembelian
            </ListGroupItem>
            <ListGroupItem tag={Link} to="/products" action>
              Produk
            </ListGroupItem>
            <ListGroupItem tag={Link} to="/categories" action>
              Kategori
            </ListGroupItem>
            <ListGroupItem tag={Link} to="/suppliers" action>
              Suplier
            </ListGroupItem>
            <ListGroupItem
              tag="a"
              href="#"
              onClick={handleLogout}
              className="text-danger"
              action
            >
              Logout
            </ListGroupItem>
          </ListGroup>
        </Col>

        <Col
          style={{
            minHeight: 500,
            paddingBottom: 100
          }}
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default Layout;
```

edit `src/ProtectedPage.js` untuk menggunakan layout

```javascript
import React, { useEffect } from 'react';
import { getToken } from './utils';
import Layout from './Layout';

function ProtectedPage(props) {
  const { history } = props;
  useEffect(() => {
    const token = getToken();
    if (!token) {
      history.push('/login');
    }
  });

  return (
    <Layout {...props}>
      <h2>Content</h2>
    </Layout>
  );
}

export default ProtectedPage;
```

buat function baru di `src/auth/api.js` untuk logout

```javascript
export function logout(token) {
  return axios({
    method: 'POST',
    url: `${baseUrl}/logout`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}
```

## nested route di dalam ProtectedPage

edit `src/ProtectedPage.js` untuk setup route

```javascript
import React, { useEffect } from 'react';
import { getToken } from './utils';
import Layout from './Layout';
import { Switch, Route, Redirect } from 'react-router-dom';
import DashboardPage from './dashboard/DashboardPage';
import SuppliersPage from './supplier/SuppliersPage';

function ProtectedPage(props) {
  const { history } = props;
  useEffect(() => {
    const token = getToken();
    if (!token) {
      history.push('/login');
    }
  });

  return (
    <Layout {...props}>
      <Switch>
        <Route path="/suppliers" component={SuppliersPage} />
        <Route exact path="/" component={DashboardPage} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default ProtectedPage;
```

buat file baru `src/supplier/SuppliersPage.js`

```javascript
import React from 'react';

function SuppliersPage() {
  return (
    <h2 className="mb-5">Supplier</h2>
  );
}

export default SuppliersPage;
```

edit `src/dashboard/DashboardPage.js`

```javascript
import React from 'react';

function DashboardPage() {
  return (
    <h2 className="mb-5">Dashboard</h2>
  );
}

export default DashboardPage;
```

## supplier

### list supplier

buat file baru `src/supplier/api.js` untuk get data

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function getSuppliers(token, page = 1) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/suppliers?page=${page}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}
```

edit file `src/supplier/SuppliersPage.js` untuk menampilkan data

```javascript
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from 'react-reactstrap-pagination';
import SupplierList from './components/SupplierList';
import { getToken } from '../utils';
import { getSuppliers } from './api';
import toast from 'toasted-notes';

function SuppliersPage(props) {
  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchSuppliers = page => {
    const token = getToken();
    getSuppliers(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Terjadi kesalahan, silahkan coba lagi';

        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ));
      });
  };
  const changePage = page => {
    fetchSuppliers(page);
  };

  useEffect(() => {
    fetchSuppliers(1);
  }, []);

  const gotoItem = item => {
    const {history} = props
    history.push(`/suppliers/${item.id}`)
  }

  return (
    <div>
      <h2 className="mb-5">Supplier</h2>

      <Button tag={Link} to="/suppliers/create" color="primary" className="mb-3">
        Tambah
      </Button>

      <SupplierList data={pagination.data} onItemSelected={gotoItem} />

      {pagination.total > pagination.perPage ? (
        <PaginationComponent
          totalItems={pagination.total}
          pageSize={pagination.perPage}
          activePage={pagination.page}
          onSelect={changePage}
        />
      ) : null}
    </div>
  );
}

export default SuppliersPage;
```

buat file baru `src/supplier/components/SupplierList.js`

```javascript
import React from 'react';
import { Table } from 'reactstrap';
import SupplierItem from './SupplierItem';

function SupplierList(props) {
  const { data, onItemSelected } = props;
  return (
    <div className="table-responsive">
      <Table hover className="mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Alamat</th>
            <th>Telepon</th>
          </tr>
        </thead>
        <tbody>
          {data.map(supplier => (
            <SupplierItem
              key={supplier.id}
              item={supplier}
              onClick={onItemSelected}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SupplierList;
```

buat file baru `src/supplier/components/SupplierItem.js`

```javascript
import React from 'react';

function SupplierItem(props) {
  const { item, onClick } = props;
  return (
    <tr onClick={() => onClick(item)}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.address}</td>
      <td>{item.phone}</td>
    </tr>
  );
}

export default SupplierItem;
```

install pagination component `npm i -S react-reactstrap-pagination`

### tambah supplier

buat function baru di `src/supplier/api.js` untuk menambah data

```javascript
export function postSupplier(token, payload) {
  const { name, email, phone, address } = payload;
  return axios({
    method: 'POST',
    url: `${baseUrl}/suppliers`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name,
      email,
      phone,
      address
    }
  });
}
```

buat file baru `src/supplier/SupplierCreatePage.js` untuk form tambah data

```javascript
import React, { useState } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { postSupplier } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function SupplierCreatePage(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const token = getToken();
    const payload = {
      name,
      email,
      phone,
      address
    };
    postSupplier(token, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil tambah data
          </Alert>
        ));
        history.push('/suppliers');
      })
      .catch(error => {
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Tambah Supplier</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Telepon</Label>
          <Input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Alamat</Label>
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            type="textarea"
            required
          />
        </FormGroup>
        <Button color="primary">Simpan</Button>
      </Form>
    </div>
  );
}

export default SupplierCreatePage;
```

untuk handle error, tambah function di `src/utils.js`

```javascript
import React from 'react';
import { Alert } from 'reactstrap';
import toast from 'toasted-notes';

// ...

// https://github.com/axios/axios#handling-errors
export function handleError(axiosError) {
  if (axiosError.response) {
    const message = axiosError.response.data.message;

    toast.notify(({ onClose }) => (
      <Alert color="danger" toggle={onClose}>
        {message}
      </Alert>
    ));

    // validation error
    if (axiosError.response.status === 422) {
      const validationErrors = axiosError.response.data.errors;
      Object.keys(validationErrors).forEach(key => {
        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {validationErrors[key].join('\n')}
          </Alert>
        ));
      });
    }
  } else {
    toast.notify(({ onClose }) => (
      <Alert color="danger" toggle={onClose}>
        Terjadi kesalahan, silahkan coba lagi
      </Alert>
    ));
  }
}
```

tambahkan route di dalam `src/ProtectedPage.js`

```javascript
import SupplierCreatePage from './supplier/SupplierCreatePage';

// ...

<Route path="/suppliers/create" component={SupplierCreatePage} />
```

### update & delete supplier

tambah function di `src/supplier/api.js` untuk ambil detail & update

```javascript
export function getSupplier(token, supplierId) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/suppliers/${supplierId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function putSupplier(token, supplierId, payload) {
  const { name, email, phone, address } = payload;
  return axios({
    method: 'PUT',
    url: `${baseUrl}/suppliers/${supplierId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name,
      email,
      phone,
      address
    }
  });
}

export function deleteSupplier(token, supplierId) {
  return axios({
    method: 'DELETE',
    url: `${baseUrl}/suppliers/${supplierId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
```

tambah file baru untuk halaman edit `src/supplier/SupplierEditPage.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { getSupplier, deleteSupplier, putSupplier } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function SupplierEditPage(props) {
  const { match, history } = props;
  const { supplierId } = match.params;

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setLoading(true);

    const token = getToken();
    getSupplier(token, supplierId)
      .then(response => {
        const data = response.data;
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  }, [supplierId]);

  const handleDelete = () => {
    if (loading) return;

    setLoading(true);

    const token = getToken();
    setLoading(true);
    deleteSupplier(token, supplierId)
      .then(response => {
        toast.notify(({ onClose }) => (
          <Alert color="info" toggle={onClose}>
            Berhasil hapus data
          </Alert>
        ));
        setLoading(false);
        history.push('/suppliers');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  const handleSubmit = e => {
    if (loading) return;

    e.preventDefault();

    setLoading(true);

    const token = getToken();
    const payload = {
      name,
      email,
      phone,
      address
    };
    putSupplier(token, supplierId, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil update data
          </Alert>
        ));

        setLoading(false);
        history.push('/suppliers');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Supplier Detail</h2>
      <Form disabled={loading} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Telepon</Label>
          <Input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Alamat</Label>
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            type="textarea"
            required
          />
        </FormGroup>
        <Button color="primary">Simpan</Button>
        <Button
          onClick={handleDelete}
          color="link"
          type="button"
          className="float-right text-danger"
        >
          Hapus
        </Button>
      </Form>
    </div>
  );
}

export default SupplierEditPage;
```

tambahkan route baru di `src/ProtectedPage.js`

```javascript
import SupplierEditPage from './supplier/SupplierEditPage';

// ...

<Route path="/suppliers/create" component={SupplierCreatePage} />
<Route path="/suppliers/:supplierId" component={SupplierEditPage} /> // <---- tambahkan dibawah /create
```

### urutan route

pastikan menambahkan route untuk edit dibawah route untuk create.
karena route edit menggunakan syntax wildcard, jadi kalau route edit ditempatkan diatas route create maka saat kita mengakses url `/suppliers/create` akan tertangkap di route edit, dan halaman yang tampil malah halaman edit.

## kategori produk

### api

buat file baru untuk memanggil api `src/category/api.js`

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function getCategories(token, page = 1) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/categories?page=${page}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function postCategory(token, payload) {
  const { name } = payload;
  return axios({
    method: 'POST',
    url: `${baseUrl}/categories`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name
    }
  });
}

export function getCategory(token, categoryId) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/categories/${categoryId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function putCategory(token, categoryId, payload) {
  const { name } = payload;
  return axios({
    method: 'PUT',
    url: `${baseUrl}/categories/${categoryId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name
    }
  });
}

export function deleteCategory(token, categoryId) {
  return axios({
    method: 'DELETE',
    url: `${baseUrl}/categories/${categoryId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
```

### list kategori
buat file baru untuk menampilkan data `src/category/CategoriesPage.js`

```javascript
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from 'react-reactstrap-pagination';
import CategoryList from './components/CategoryList';
import { getToken } from '../utils';
import { getCategories } from './api';
import toast from 'toasted-notes';

function CategoriesPage(props) {
  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchCategories = page => {
    const token = getToken();
    getCategories(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Terjadi kesalahan, silahkan coba lagi';
        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ));
      });
  };
  const changePage = page => {
    fetchCategories(page);
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const gotoItem = item => {
    const { history } = props;
    history.push(`/categories/${item.id}`);
  };

  return (
    <div>
      <h2 className="mb-5">Kategori Produk</h2>

      <Button
        tag={Link}
        to="/categories/create"
        color="primary"
        className="mb-3"
      >
        Tambah
      </Button>

      <CategoryList data={pagination.data} onItemSelected={gotoItem} />

      {pagination.total > pagination.perPage ? (
        <PaginationComponent
          totalItems={pagination.total}
          pageSize={pagination.perPage}
          activePage={pagination.page}
          onSelect={changePage}
        />
      ) : null}
    </div>
  );
}

export default CategoriesPage;
```

buat file `src/category/components/CategoryList.js`

```javascript
import React from 'react';
import { Table } from 'reactstrap';
import CategoryItem from './CategoryItem';

function CategoryList(props) {
  const { data, onItemSelected } = props;
  return (
    <div className="table-responsive">
      <Table hover className="mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
          </tr>
        </thead>
        <tbody>
          {data.map(category => (
            <CategoryItem
              key={category.id}
              item={category}
              onClick={onItemSelected}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CategoryList;
```

buat file `src/category/components/CategoryItem.js`

```javascript
import React from 'react';

function CategoryItem(props) {
  const { item, onClick } = props;
  return (
    <tr onClick={() => onClick(item)}>
      <td>{item.id}</td>
      <td>{item.name}</td>
    </tr>
  );
}

export default CategoryItem;
```

### tambah kategori
buat file `src/category/CategoryCreatePage.js`

```javascript
import React, { useState } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { postCategory } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function CategoryCreatePage(props) {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const token = getToken();
    const payload = {
      name
    };
    postCategory(token, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil tambah data
          </Alert>
        ));
        history.push('/categories');
      })
      .catch(error => {
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Tambah Kategori Produk</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary">Simpan</Button>
      </Form>
    </div>
  );
}

export default CategoryCreatePage;
```

### update & delete kategori

buat file `src/category/CategoryEditPage.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { getCategory, deleteCategory, putCategory } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function CategoryEditPage(props) {
  const { match, history } = props;
  const { categoryId } = match.params;

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  useEffect(() => {
    setLoading(true);

    const token = getToken();
    getCategory(token, categoryId)
      .then(response => {
        const data = response.data;
        setName(data.name);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  }, [categoryId]);

  const handleDelete = () => {
    if (loading) return;

    setLoading(true);

    const token = getToken();
    setLoading(true);
    deleteCategory(token, categoryId)
      .then(response => {
        toast.notify(({ onClose }) => (
          <Alert color="info" toggle={onClose}>
            Berhasil hapus data
          </Alert>
        ));
        setLoading(false);
        history.push('/categories');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  const handleSubmit = e => {
    if (loading) return;

    e.preventDefault();

    setLoading(true);

    const token = getToken();
    const payload = {
      name,
    };
    putCategory(token, categoryId, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil update data
          </Alert>
        ));

        setLoading(false);
        history.push('/categories');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Detail Kategori Produk</h2>
      <Form disabled={loading} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary">Simpan</Button>
        <Button
          onClick={handleDelete}
          color="link"
          type="button"
          className="float-right text-danger"
        >
          Hapus
        </Button>
      </Form>
    </div>
  );
}

export default CategoryEditPage;
```

### routing

tambahkan routing di `src/ProtectedPage.js`

```javascript
import CategoriesPage from './category/CategoriesPage';
import CategoryCreatePage from './category/CategoryCreatePage';
import CategoryEditPage from './category/CategoryEditPage';

// ...

<Route path="/categories/create" component={CategoryCreatePage} />
<Route path="/categories/:categoryId" component={CategoryEditPage} />
<Route path="/categories" component={CategoriesPage} />
```

## produk
### api
buat file baru untuk menghandle api `src/product/api.js`

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function getProducts(token, page = 1) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/products?page=${page}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function postProduct(token, payload) {
  const {
    name,
    desc,
    category_id,
    price_purchase,
    price_sale,
    stock
  } = payload;
  return axios({
    method: 'POST',
    url: `${baseUrl}/products`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name,
      desc,
      category_id,
      price_purchase,
      price_sale,
      stock
    }
  });
}

export function getProduct(token, productId) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/products/${productId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function putProduct(token, productId, payload) {
  const {
    name,
    desc,
    category_id,
    price_purchase,
    price_sale,
    stock
  } = payload;
  return axios({
    method: 'PUT',
    url: `${baseUrl}/products/${productId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      name,
      desc,
      category_id,
      price_purchase,
      price_sale,
      stock
    }
  });
}

export function deleteProduct(token, productId) {
  return axios({
    method: 'DELETE',
    url: `${baseUrl}/products/${productId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
```

### list produk
buat file untuk list produk `src/product/ProductsPage.js`

```javascript
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from 'react-reactstrap-pagination';
import ProductList from './components/ProductList';
import { getToken } from '../utils';
import { getProducts } from './api';
import toast from 'toasted-notes';

function ProductsPage(props) {
  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchProducts = page => {
    const token = getToken();
    getProducts(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Terjadi kesalahan, silahkan coba lagi';
        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ));
      });
  };
  const changePage = page => {
    fetchProducts(page);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const gotoItem = item => {
    const { history } = props;
    history.push(`/products/${item.id}`);
  };

  return (
    <div>
      <h2 className="mb-5">Produk</h2>

      <Button
        tag={Link}
        to="/products/create"
        color="primary"
        className="mb-3"
      >
        Tambah
      </Button>

      <ProductList data={pagination.data} onItemSelected={gotoItem} />

      {pagination.total > pagination.perPage ? (
        <PaginationComponent
          totalItems={pagination.total}
          pageSize={pagination.perPage}
          activePage={pagination.page}
          onSelect={changePage}
        />
      ) : null}
    </div>
  );
}

export default ProductsPage;
```

buat file baru `src/product/components/ProductList.js`

```javascript
import React from 'react';
import { Table } from 'reactstrap';
import ProductItem from './ProductItem';

function ProductList(props) {
  const { data, onItemSelected } = props;
  return (
    <div className="table-responsive">
      <Table hover className="mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Harga Beli</th>
            <th>Harga Jual</th>
            <th>Kategori</th>
            <th>Stok</th>
            <th>Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {data.map(product => (
            <ProductItem
              key={product.id}
              item={product}
              onClick={onItemSelected}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductList;
```

buat file baru `src/product/components/ProductItem.js`

```javascript
import React from 'react';

function ProductItem(props) {
  const { item, onClick } = props;
  return (
    <tr onClick={() => onClick(item)}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.price_purchase}</td>
      <td>{item.price_sale}</td>
      <td>{item.category.name}</td>
      <td>{item.stock}</td>
      <td>{item.desc}</td>
    </tr>
  );
}

export default ProductItem;
```

### tambah produk
buat file baru untuk form tambah `src/product/ProductCreatePage.js`

```javascript
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';
import CategorySelectionModal from './components/CategorySelectionModal';
import { postProduct } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function ProductCreatePage(props) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price_purchase, setPricePurchase] = useState('');
  const [price_sale, setPriceSale] = useState('');
  const [stock, setStock] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleSelectCategory = category => {
    setSelectedCategory(category);
    setModalOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const token = getToken();
    const payload = {
      name,
      desc,
      category_id: selectedCategory.id,
      price_purchase,
      price_sale,
      stock
    };
    postProduct(token, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil tambah data
          </Alert>
        ));
        history.push('/products');
      })
      .catch(error => {
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Tambah Produk</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Deskripsi</Label>
          <Input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            type="textarea"
          />
        </FormGroup>
        <FormGroup>
          <Label>Harga Beli</Label>
          <Input
            value={price_purchase}
            onChange={e => setPricePurchase(e.target.value)}
            type="number"
            min={0}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Harga Jual</Label>
          <Input
            value={price_sale}
            onChange={e => setPriceSale(e.target.value)}
            type="number"
            min={0}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Stok</Label>
          <Input
            value={stock}
            onChange={e => setStock(e.target.value)}
            type="number"
            min={1}
          />
        </FormGroup>
        <FormGroup>
          <Label>Kategori</Label>
          <InputGroup>
            <Input
              value={selectedCategory ? selectedCategory.name : ''}
              onChange={() => {}}
              onClick={() => setModalOpen(true)}
              placeholder="Pilih Kategori"
              required
            />
            {selectedCategory ? (
              <InputGroupAddon
                tag="a"
                href="#"
                className="text-decoration-none"
                onClick={() => setSelectedCategory(null)}
                addonType="append"
              >
                <InputGroupText>Hapus</InputGroupText>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </FormGroup>
        <Button color="primary">Simpan</Button>
      </Form>
      <CategorySelectionModal
        isOpen={isModalOpen}
        toggle={() => setModalOpen(false)}
        onItemSelected={handleSelectCategory}
      />
    </div>
  );
}

export default ProductCreatePage;
```

#### pilihan kategori

buat file untuk pilihan kategori untuk produk `src/product/components/CategorySelectionModal.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CategoryList from '../../category/components/CategoryList';
import PaginationComponent from 'react-reactstrap-pagination';
import { getCategories } from '../../category/api';
import { getToken, handleError } from '../../utils';

function CategorySelectionModal(props) {
  const { isOpen, toggle, onItemSelected } = props;

  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchCategories = page => {
    const token = getToken();
    getCategories(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const changePage = page => {
    fetchCategories(page);
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>Pilih Kategori</ModalHeader>
      <ModalBody>
        <CategoryList data={pagination.data} onItemSelected={onItemSelected} />
      </ModalBody>
      <ModalFooter>
        {pagination.total > pagination.perPage ? (
          <PaginationComponent
            totalItems={pagination.total}
            pageSize={pagination.perPage}
            activePage={pagination.page}
            onSelect={changePage}
          />
        ) : null}
      </ModalFooter>
    </Modal>
  );
}

export default CategorySelectionModal;
```

### update produk & delete produk
buat file untuk detail & edit & hapus data `src/product/ProductEditPage.js`

```javascript
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';
import CategorySelectionModal from './components/CategorySelectionModal';
import { getProduct, deleteProduct, putProduct } from './api';
import { getToken, handleError } from '../utils';
import toast from 'toasted-notes';

function ProductEditPage(props) {
  const { match, history } = props;
  const { productId } = match.params;

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price_purchase, setPricePurchase] = useState('');
  const [price_sale, setPriceSale] = useState('');
  const [stock, setStock] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleSelectCategory = category => {
    setSelectedCategory(category);
    setModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);

    const token = getToken();
    getProduct(token, productId)
      .then(response => {
        const data = response.data;
        setName(data.name);
        setDesc(data.desc);
        setPricePurchase(data.price_purchase);
        setPriceSale(data.price_sale);
        setStock(data.stock);
        setSelectedCategory(data.category);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  }, [productId]);

  const handleDelete = () => {
    if (loading) return;

    setLoading(true);

    const token = getToken();
    setLoading(true);
    deleteProduct(token, productId)
      .then(response => {
        toast.notify(({ onClose }) => (
          <Alert color="info" toggle={onClose}>
            Berhasil hapus data
          </Alert>
        ));
        setLoading(false);
        history.push('/products');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  const handleSubmit = e => {
    if (loading) return;

    e.preventDefault();

    setLoading(true);

    const token = getToken();
    const payload = {
      name,
      desc,
      price_purchase,
      price_sale,
      stock,
      category_id: selectedCategory.id
    };
    putProduct(token, productId, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil update data
          </Alert>
        ));

        setLoading(false);
        history.push('/products');
      })
      .catch(error => {
        setLoading(false);
        handleError(error);
      });
  };

  return (
    <div>
      <h2 className="mb-5">Detail Produk</h2>
      <Form disabled={loading} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Deskripsi</Label>
          <Input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            type="textarea"
          />
        </FormGroup>
        <FormGroup>
          <Label>Harga Beli</Label>
          <Input
            value={price_purchase}
            onChange={e => setPricePurchase(e.target.value)}
            type="number"
            min={0}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Harga Jual</Label>
          <Input
            value={price_sale}
            onChange={e => setPriceSale(e.target.value)}
            type="number"
            min={0}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Stok</Label>
          <Input
            value={stock}
            onChange={e => setStock(e.target.value)}
            type="number"
            min={1}
          />
        </FormGroup>
        <FormGroup>
          <Label>Kategori</Label>
          <InputGroup>
            <Input
              value={selectedCategory ? selectedCategory.name : ''}
              onChange={() => {}}
              onClick={() => setModalOpen(true)}
              placeholder="Pilih Kategori"
              required
            />
            {selectedCategory ? (
              <InputGroupAddon
                tag="a"
                href="#"
                className="text-decoration-none"
                onClick={() => setSelectedCategory(null)}
                addonType="append"
              >
                <InputGroupText>Hapus</InputGroupText>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </FormGroup>
        <Button color="primary">Simpan</Button>
        <Button
          onClick={handleDelete}
          color="link"
          type="button"
          className="float-right text-danger"
        >
          Hapus
        </Button>
      </Form>
      <CategorySelectionModal
        isOpen={isModalOpen}
        toggle={() => setModalOpen(false)}
        onItemSelected={handleSelectCategory}
      />
    </div>
  );
}

export default ProductEditPage;
```

### routing

tambahkan routing di `src/ProtectedPage.js`

```javascript
import ProductsPage from './product/ProductsPage';
import ProductCreatePage from './product/ProductCreatePage';
import ProductEditPage from './product/ProductEditPage';

// ...

<Route path="/products/create" component={ProductCreatePage} />
<Route path="/products/:categoryId" component={ProductEditPage} />
<Route path="/products" component={ProductsPage} />
```


## transaksi pembelian
### api
buat file untuk manghandle api `src/purchase/api.js`

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function getPurchases(token, page = 1) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/transactions/purchases?page=${page}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function postPurchase(token, payload) {
  const {
    supplier_id,
    details
  } = payload;
  return axios({
    method: 'POST',
    url: `${baseUrl}/transactions/purchases`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      supplier_id,
      details
    }
  });
}

export function getPurchase(token, purchaseId) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/transactions/purchases/${purchaseId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
```

### list transaksi pembelian
buat file untuk list pembelian `src/purchase/PurchasesPage.js`

```javascript
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from 'react-reactstrap-pagination';
import PurchaseList from './components/PurchaseList';
import { getToken } from '../utils';
import { getPurchases } from './api';
import toast from 'toasted-notes';

function PurchasesPage(props) {
  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchPurchases = page => {
    const token = getToken();
    getPurchases(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Terjadi kesalahan, silahkan coba lagi';
        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ));
      });
  };
  const changePage = page => {
    fetchPurchases(page);
  };

  useEffect(() => {
    fetchPurchases(1);
  }, []);

  const gotoItem = item => {
    const { history } = props;
    history.push(`/purchases/${item.id}`);
  };

  return (
    <div>
      <h2 className="mb-5">Daftar Pembelian</h2>

      <Button
        tag={Link}
        to="/purchases/create"
        color="primary"
        className="mb-3"
      >
        Tambah
      </Button>

      <PurchaseList data={pagination.data} onItemSelected={gotoItem} />

      {pagination.total > pagination.perPage ? (
        <PaginationComponent
          totalItems={pagination.total}
          pageSize={pagination.perPage}
          activePage={pagination.page}
          onSelect={changePage}
        />
      ) : null}
    </div>
  );
}

export default PurchasesPage;
```

buat file component `src/purchase/components/PurchaseList.js`

```javascript
import React from 'react';
import { Table } from 'reactstrap';
import PurchaseItem from './PurchaseItem';

function PurchaseList(props) {
  const { data, onItemSelected } = props;
  return (
    <div className="table-responsive">
      <Table hover className="mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(purchase => (
            <PurchaseItem
              key={purchase.id}
              item={purchase}
              onClick={onItemSelected}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PurchaseList;
```

buat file component `src/purchase/PurchaseItem.js`

```javascript
import React from 'react';
import { formatMoney } from '../../utils';

function PurchaseItem(props) {
  const { item, onClick } = props;
  return (
    <tr onClick={() => onClick(item)}>
      <td>{item.id}</td>
      <td>{item.supplier.name}</td>
      <td>{formatMoney(item.total)}</td>
    </tr>
  );
}

export default PurchaseItem;
```

tambahkan function di `src/utils.js` untuk format angka

```javascript
export function formatMoney(amount) {
  return new Intl.NumberFormat('id').format(amount);
}
```

### tambah transaksi pembelian

buat file untuk transaksi pembelian `src/purchase/PurchaseCreatePage.js`

```javascript
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';
import SupplierSelectionModal from './components/SupplierSelectionModal';
import ProductSelectionModal from './components/ProductSelectionModal';
import PurchaseProductList from './components/PurchaseProductList';
import { postPurchase } from './api';
import { getToken, handleError, formatMoney } from '../utils';
import toast from 'toasted-notes';

function PurchaseCreatePage(props) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [purchaseItems, setPurchaseItems] = useState([]);

  const [isSupplierModalOpen, setSupplierModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const handleSelectProduct = product => {
    const alreadyExists = purchaseItems.find(
      _item => _item.product_id === product.id
    );
    if (alreadyExists) {
      setPurchaseItems(purchaseItems);
    } else {
      const newItem = {
        product_id: product.id,
        qty: 1,
        product
      };
      setPurchaseItems(purchaseItems.concat(newItem));
    }

    setProductModalOpen(false);
  };

  const handleItemQtyChange = (item, qty) => {
    const newPurchaseItems = purchaseItems.map(_item => {
      if (_item.product_id === item.product_id) {
        return {
          ..._item,
          qty
        };
      } else {
        return _item;
      }
    });
    setPurchaseItems(newPurchaseItems);
  };

  const handleItemRemove = item => {
    const newPurchaseItems = purchaseItems.filter(
      _item => _item.product_id !== item.product_id
    );
    setPurchaseItems(newPurchaseItems);
  };

  const handleSelectSupplier = supplier => {
    setSelectedSupplier(supplier);
    setSupplierModalOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const token = getToken();
    const payload = {
      supplier_id: selectedSupplier.id,
      details: purchaseItems
    };
    postPurchase(token, payload)
      .then(response => {
        const { history } = props;
        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil tambah data
          </Alert>
        ));
        history.push('/purchases');
      })
      .catch(error => {
        handleError(error);
      });
  };

  const calculateTotal = () => {
    return purchaseItems.reduce(
      (total, item) => total + item.qty * item.product.price_purchase,
      0
    );
  };

  return (
    <div>
      <h2 className="mb-5">Transaksi Pembelian</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Supplier</Label>
          <InputGroup>
            <Input
              value={selectedSupplier ? selectedSupplier.name : ''}
              onChange={() => {}}
              onClick={() => setSupplierModalOpen(true)}
              placeholder="Pilih Supplier"
              required
            />
            {selectedSupplier ? (
              <InputGroupAddon
                tag="a"
                href="#"
                className="text-decoration-none"
                onClick={() => setSelectedSupplier(null)}
                addonType="append"
              >
                <InputGroupText>Hapus</InputGroupText>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </FormGroup>

        <PurchaseProductList
          items={purchaseItems}
          onItemAdd={() => setProductModalOpen(true)}
          onItemQtyChange={handleItemQtyChange}
          onItemRemove={handleItemRemove}
        />

        <h2 className="display-4 text-bold font-weight-bold text-right">
          TOTAL: {formatMoney(calculateTotal())}
        </h2>

        <Button color="primary" size="lg">
          Simpan
        </Button>
      </Form>
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        toggle={() => setProductModalOpen(false)}
        onItemSelected={handleSelectProduct}
      />
      <SupplierSelectionModal
        isOpen={isSupplierModalOpen}
        toggle={() => setSupplierModalOpen(false)}
        onItemSelected={handleSelectSupplier}
      />
    </div>
  );
}

export default PurchaseCreatePage;
```

buat file untuk pilihan produk `src/purchase/components/ProductSelectionModal.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProductList from '../../product/components/ProductList';
import PaginationComponent from 'react-reactstrap-pagination';
import { getProducts } from '../../product/api';
import { getToken, handleError } from '../../utils';

function ProductSelectionModal(props) {
  const { isOpen, toggle, onItemSelected } = props;

  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchProducts = page => {
    const token = getToken();
    getProducts(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const changePage = page => {
    fetchProducts(page);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>Pilih Supplier</ModalHeader>
      <ModalBody>
        <ProductList data={pagination.data} onItemSelected={onItemSelected} />
      </ModalBody>
      <ModalFooter>
        {pagination.total > pagination.perPage ? (
          <PaginationComponent
            totalItems={pagination.total}
            pageSize={pagination.perPage}
            activePage={pagination.page}
            onSelect={changePage}
          />
        ) : null}
      </ModalFooter>
    </Modal>
  );
}

export default ProductSelectionModal;
```

buat file untuk pilihan supplier `src/purchase/components/SupplierSelectionModal.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SupplierList from '../../supplier/components/SupplierList';
import PaginationComponent from 'react-reactstrap-pagination';
import { getSuppliers } from '../../supplier/api';
import { getToken, handleError } from '../../utils';

function SupplierSelectionModal(props) {
  const { isOpen, toggle, onItemSelected } = props;

  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchSuppliers = page => {
    const token = getToken();
    getSuppliers(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const changePage = page => {
    fetchSuppliers(page);
  };

  useEffect(() => {
    fetchSuppliers(1);
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>Pilih Supplier</ModalHeader>
      <ModalBody>
        <SupplierList data={pagination.data} onItemSelected={onItemSelected} />
      </ModalBody>
      <ModalFooter>
        {pagination.total > pagination.perPage ? (
          <PaginationComponent
            totalItems={pagination.total}
            pageSize={pagination.perPage}
            activePage={pagination.page}
            onSelect={changePage}
          />
        ) : null}
      </ModalFooter>
    </Modal>
  );
}

export default SupplierSelectionModal;
```

compnent untuk list detail pembelian `src/purchase/components/PurchaseProductList.js`

```javascript
import React from 'react';
import { Button, Table } from 'reactstrap';
import PurchaseProductItem from './PurchaseProductItem';

function PurchaseProductList(props) {
  const { items, onItemAdd, onItemQtyChange, onItemRemove } = props;
  return (
    <div className="table-responsive">
      <Table>
        <thead>
          <tr>
            <th />
            <th>ID</th>
            <th>Nama</th>
            <th>Jml</th>
            <th>Harga</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <PurchaseProductItem
              key={item.product_id}
              item={item}
              onQtyChange={onItemQtyChange}
              onRemove={onItemRemove}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} className="text-center">
              <Button color="link" size="sm" onClick={onItemAdd}>
                [+] Tambah Item
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

export default PurchaseProductList;
```

component untuk item detail pembelian `src/purchase/components/PurchaseProductItem.js`

```javascript
import React from 'react';
import { Button, Input } from 'reactstrap';
import { formatMoney } from '../../utils';

function PurchaseProductItem(props) {
  const { item, onRemove, onQtyChange } = props;
  return (
    <tr>
      <td>
        <Button close onClick={() => onRemove(item)} />
      </td>
      <td>{item.product_id}</td>
      <td>{item.product.name}</td>
      <td>
        <Input
          value={item.qty}
          onChange={e => onQtyChange(item, e.target.value)}
          type="number"
          min={1}
          style={{ maxWidth: 80 }}
        />
      </td>
      <td>{formatMoney(item.product.price_purchase)}</td>
      <td>{formatMoney(item.qty * item.product.price_purchase)}</td>
    </tr>
  );
}

export default PurchaseProductItem;
```

### routing

tambahkan routing di `src/ProtectedPage.js`

```javascript
import PurchasesPage from './purchase/PurchasesPage';
import PurchaseCreatePage from './purchase/PurchaseCreatePage';

// ...

<Route path="/purchases/create" component={PurchaseCreatePage} />
<Route path="/purchases" component={PurchasesPage} />
```

## transaksi penjualan
### api
buat file untuk handle api `src/sale/api.js`

```javascript
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export function getSales(token, page = 1) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/transactions/sales?page=${page}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export function postSale(token, payload) {
  const {
    pay,
    details
  } = payload;
  return axios({
    method: 'POST',
    url: `${baseUrl}/transactions/sales`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: {
      pay,
      details
    }
  });
}

export function getSale(token, saleId) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/transactions/sales/${saleId}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
```

### list transaksi penjualan
buat file untuk list penjualan `src/sale/SalesPage.js`
```javascript
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from 'react-reactstrap-pagination';
import SaleList from './components/SaleList';
import { getToken } from '../utils';
import { getSales } from './api';
import toast from 'toasted-notes';

function SalesPage(props) {
  const paginationState = {
    data: [],
    total: 0,
    page: 1,
    perPage: 10
  };
  const [pagination, setPagination] = useState(paginationState);

  const fetchSales = page => {
    const token = getToken();
    getSales(token, page)
      .then(response => {
        const { data, current_page, total, per_page } = response.data;
        setPagination({
          data,
          total,
          page: current_page,
          perPage: per_page
        });
      })
      .catch(error => {
        const message = error.response
          ? error.response.data.message
          : 'Terjadi kesalahan, silahkan coba lagi';
        toast.notify(({ onClose }) => (
          <Alert color="danger" toggle={onClose}>
            {message}
          </Alert>
        ));
      });
  };
  const changePage = page => {
    fetchSales(page);
  };

  useEffect(() => {
    fetchSales(1);
  }, []);

  const gotoItem = item => {
    const { history } = props;
    history.push(`/sales/${item.id}`);
  };

  return (
    <div>
      <h2 className="mb-5">Daftar Penjualan</h2>

      <Button
        tag={Link}
        to="/sales/create"
        color="primary"
        className="mb-3"
      >
        Tambah
      </Button>

      <SaleList data={pagination.data} onItemSelected={gotoItem} />

      {pagination.total > pagination.perPage ? (
        <PaginationComponent
          totalItems={pagination.total}
          pageSize={pagination.perPage}
          activePage={pagination.page}
          onSelect={changePage}
        />
      ) : null}
    </div>
  );
}

export default SalesPage;
```

component untuk list penjualan `src/sale/components/SaleList.js`
```javascript
import React from 'react';
import { Table } from 'reactstrap';
import SaleItem from './SaleItem';

function SaleList(props) {
  const { data, onItemSelected } = props;
  return (
    <div className="table-responsive">
      <Table hover className="mb-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(sale => (
            <SaleItem
              key={sale.id}
              item={sale}
              onClick={onItemSelected}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SaleList;
```

component item di list penjualan `src/sale/components/SaleItem.js`
```javascript
import React from 'react';
import { formatMoney } from '../../utils';

function PurchaseItem(props) {
  const { item, onClick } = props;
  return (
    <tr onClick={() => onClick(item)}>
      <td>{item.id}</td>
      <td>{formatMoney(item.total)}</td>
    </tr>
  );
}

export default PurchaseItem;
```
### tambah transaksi penjualan
buat file untuk halaman transaksi penjualan `src/sale/SaleCreatePage.js`
```javascript
import React, { useState } from 'react';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';
import ProductSelectionModal from '../purchase/components/ProductSelectionModal';
import SaleProductList from './components/SaleProductList';
import { postSale } from './api';
import { getToken, handleError, formatMoney } from '../utils';
import toast from 'toasted-notes';

function SaleCreatePage(props) {
  const [pay, setPayAmount] = useState('');
  const [saleItems, setSaleItems] = useState([]);

  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const handleSelectProduct = product => {
    const alreadyExists = saleItems.find(
      _item => _item.product_id === product.id
    );
    if (alreadyExists) {
      setSaleItems(saleItems);
    } else {
      const newItem = {
        product_id: product.id,
        qty: 1,
        product
      };
      setSaleItems(saleItems.concat(newItem));
    }

    setProductModalOpen(false);
  };

  const handleItemQtyChange = (item, qty) => {
    const newSaleItems = saleItems.map(_item => {
      if (_item.product_id === item.product_id) {
        return {
          ..._item,
          qty
        };
      } else {
        return _item;
      }
    });
    setSaleItems(newSaleItems);
  };

  const handleItemRemove = item => {
    const newSaleItems = saleItems.filter(
      _item => _item.product_id !== item.product_id
    );
    setSaleItems(newSaleItems);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const token = getToken();
    const payload = {
      pay,
      details: saleItems
    };
    postSale(token, payload)
      .then(response => {
        if (response.data.change > 0) {
          toast.notify(`Kembalian: ${formatMoney(response.data.change)}`, {
            duration: null
          });
        }

        toast.notify(({ onClose }) => (
          <Alert color="success" toggle={onClose}>
            Berhasil tambah data
          </Alert>
        ));

        // reset
        setPayAmount('');
        setSaleItems([]);
        setProductModalOpen(false);
      })
      .catch(error => {
        handleError(error);
      });
  };

  const calculateTotal = () => {
    return saleItems.reduce(
      (total, item) => total + item.qty * item.product.price_sale,
      0
    );
  };

  return (
    <div>
      <h2 className="mb-5">Transaksi Penjualan</h2>
      <Form onSubmit={handleSubmit}>
        <SaleProductList
          items={saleItems}
          onItemAdd={() => setProductModalOpen(true)}
          onItemQtyChange={handleItemQtyChange}
          onItemRemove={handleItemRemove}
        />

        <h2 className="display-4 text-bold font-weight-bold text-right">
          TOTAL: {formatMoney(calculateTotal())}
        </h2>

        <FormGroup className="text-right">
          <Input
            value={pay}
            onChange={e => setPayAmount(e.target.value)}
            type="number"
            min={calculateTotal()}
            required
            placeholder="Jumlah Bayar"
            className="float-right text-right font-weight-bold"
            style={{
              maxWidth: 400,
              fontSize: 48
            }}
          />
        </FormGroup>

        <Button color="primary" size="lg">
          Simpan
        </Button>
      </Form>
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        toggle={() => setProductModalOpen(false)}
        onItemSelected={handleSelectProduct}
      />
    </div>
  );
}

export default SaleCreatePage;
```

karena `ProductSelectionModal` sudah ada, pakai component yg sama dari sebelumnya.

```javascript
import ProductSelectionModal from '../purchase/components/ProductSelectionModal';
```

buat file untuk detail penjualan `src/sale/components/SaleProductList.js`
```javascript
import React from 'react';
import { Button, Table } from 'reactstrap';
import SaleProductItem from './SaleProductItem';

function SaleProductList(props) {
  const { items, onItemAdd, onItemQtyChange, onItemRemove } = props;
  return (
    <div className="table-responsive">
      <Table>
        <thead>
          <tr>
            <th />
            <th>ID</th>
            <th>Nama</th>
            <th>Stok</th>
            <th>Jml</th>
            <th>Harga</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <SaleProductItem
              key={item.product_id}
              item={item}
              onQtyChange={onItemQtyChange}
              onRemove={onItemRemove}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} className="text-center">
              <Button color="link" size="sm" onClick={onItemAdd}>
                [+] Tambah Item
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

export default SaleProductList;
```

dan untuk detail item `src/sale/components/SaleProductItem.js`
```javascript
import React from 'react';
import { Button, Input } from 'reactstrap';
import { formatMoney } from '../../utils';

function PurchaseProductItem(props) {
  const { item, onRemove, onQtyChange } = props;
  return (
    <tr>
      <td>
        <Button close onClick={() => onRemove(item)} />
      </td>
      <td>{item.product_id}</td>
      <td>{item.product.name}</td>
      <td>{item.product.stock}</td>
      <td>
        <Input
          value={item.qty}
          onChange={e => onQtyChange(item, e.target.value)}
          type="number"
          min={1}
          max={item.product.stock}
          style={{ maxWidth: 80 }}
        />
      </td>
      <td>{formatMoney(item.product.price_sale)}</td>
      <td>{formatMoney(item.qty * item.product.price_sale)}</td>
    </tr>
  );
}

export default PurchaseProductItem;
```
### routing

```javascript
import SalesPage from './sale/SalesPage';
import SaleCreatePage from './sale/SaleCreatePage';

// ...

<Route path="/sales/create" component={SaleCreatePage} />
<Route path="/sales" component={SalesPage} />
```

## laporan dashboard
### laporan pembelian
### laporan penjualan
### laporan stock / inventory
### laporan laba rugi
