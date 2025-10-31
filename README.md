# TrainIt – Frontend (Angular)

## Historia del proyecto (Angular 13 → Angular 17)

El proyecto inició en Angular 13 y fue evolucionando hasta Angular 17. 

- Angular 13 (origen): CLI y builder basados en Webpack, RxJS 7, TS 4.x.
- Angular 14–15: adopción gradual de novedades del framework; compatibilidad con componentes standalone (opcional), mejoras en formularios tipados y materiales.
- Angular 16: mejoras de rendimiento y herramientas de compilación, preparación para nuevas features de hidratación y construcción más rápida.
- Angular 17 (estado actual): builder moderno con esbuild/Vite por defecto, tiempos de arranque y recarga más rápidos, SSR/hydration mejorados y APIs modernas del framework. El proyecto mantiene `NgModules` donde aporta organización, siguiendo buenas prácticas de lazy loading por módulos.

ADVERTENCIA
En el código se encuentra diversa sintaxis del framework. Preguntar al senior sobre la arquitectura a seguir si es que se ha definido alguna.


## Estructura general

Estructura principal del repositorio (carpetas relevantes):

```
/
├─ angular.json
├─ package.json
├─ src/
│  ├─ main.ts
│  ├─ styles.scss
│  ├─ environments/
│  ├─ app/
│  │  ├─ app.module.ts
│  │  ├─ app-routing.module.ts
│  │  ├─ layout/                # Layout (sidebar, topbar, menú, etc.)
│  │  ├─ modules/               # Módulos feature con lazy loading
│  │  │  ├─ all/
│  │  │  ├─ auth/
│  │  │  ├─ candidato-dashboard/
│  │  │  ├─ edit/
│  │  │  ├─ guards/
│  │  │  ├─ home/
│  │  │  ├─ new/
│  │  │  ├─ quiz/
│  │  │  ├─ welcome/
│  │  │  └─ welcome-candidato/
│  │  └─ shared/                # Componentes y utilidades compartidas
│  │     ├─ components/
│  │     ├─ question/
│  │     ├─ question-container/
│  │     └─ question-container-test/
│  └─ assets/                   # Imágenes y estilos de layout/theme
└─ tsconfig*.json
```

Notas de organización:

- `app/modules/*` agrupa funcionalidades de negocio en módulos autocontenidos, con su propio routing y páginas.
- `app/layout/*` contiene el esqueleto visual (topbar, sidebar, menú) y servicios relacionados a la navegación.
- `app/shared/*` centraliza componentes reutilizables y servicios transversales.
- `assets/layout/styles/*` concentra estilos globales de layout y tema.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
