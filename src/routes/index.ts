import { Router } from '../services/Router';

const routes = (router: Router): void => {
  router.get('/api/users', 'UserController@index');
  router.get('/api/users/:id', 'UserController@show');
  router.post('/api/users', 'UserController@new');
  router.put('/api/users/:id', 'UserController@edit');
  router.delete('/api/users/:id', 'UserController@delete');
};

export default routes;
