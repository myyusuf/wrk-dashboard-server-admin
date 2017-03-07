'use strict';

const ExcelReader = require('./handlers/excelreader');
const Pages = require('./handlers/pages');
const Actions = require('./handlers/actions');
const Assets = require('./handlers/assets');

const Project = require('./handlers/api/project');
const ProjectProgress = require('./handlers/api/project_progress');
// const ProjectProgress = require('./handlers/project_progress');

module.exports = [
  {
    method: 'GET',
    path: '/convert_ho',
    handler: ExcelReader.readExcelHO
  },
  {
      method: 'GET',
      path: '/',
      handler: Pages.home,
      config: {
          auth: {
              mode: 'try'
          }
        }
  },
  {
      method: 'POST',
      path: '/api/projects',
      handler: Project.create
  },
  {
      method: 'GET',
      path: '/api/projects',
      handler: Project.find,
      config: {
          auth: {
            strategy: 'session',
            scope: ['HO']
          }
      }
  },
  {
      method: 'PUT',
      path: '/api/projects/{code}',
      handler: Project.update
  },
  {
      method: 'DELETE',
      path: '/api/projects/{code}',
      handler: Project.delete
  },
  {
      method: 'GET',
      path: '/login',
      handler: Pages.login
  },
  {
      method: 'POST',
      path: '/login',
      handler: Actions.login
  },
  {
      method: 'GET',
      path: '/logout',
      handler: Actions.logout
  },
  {
      method: 'GET',
      path: '/{param*}',
      handler: Assets.servePublicDirectory
  },
  {
      method: 'POST',
      path: '/project_progress/upload',
      handler: ProjectProgress.upload,
      config: {
          payload: {
              parse: true,
              output: 'file',
              maxBytes: 4194304
          }
      }
  },
  {
      method: 'GET',
      path: '/api/project_progress',
      handler: ProjectProgress.find
  },
  {
      method: 'GET',
      path: '/hello',
      handler: function(request, reply){
        reply({result: 'hello'});
      },
      config: {
          auth: {
            strategy: 'session',
            scope: ['adminweb']
          }
      }
  }
];
