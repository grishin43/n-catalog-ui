import {CatalogEntityModel} from '../models/catalog-entity.model';
import {CatalogEntityEnum} from '../models/catalog-entity.enum';
import {NpStatusPillEnum} from '../../shared/components/small/np-status-pill/models/np-status-pill.enum';
import {v4 as uuidv4} from 'uuid';
import {EmployeeModel} from '../../models/employee.model';
import {CatalogEntityPermissionEnum} from '../models/catalog-entity-permission.enum';
import {ProcessVersionModel} from '../../models/domain/process-version.model';
import {SearchModel} from '../../models/domain/search.model';
import {HistoryTypeEnum} from '../modules/version-history/models/history-type.enum';

export class ContentHelper {

  public static get catalogMainFolders(): CatalogEntityModel[] {
    return [
      {
        id: 'npu',
        icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.0588 14.3437H21.7412L19.7841 11.2425C19.296 10.4691 18.4432 9.96448 17.5316 10.0378H3.85412C1.72094 10.0533 0 11.787 0 13.9201V39.1013C0.00258824 41.2418 1.73718 42.9764 3.87765 42.979H39.0588C41.1993 42.9764 42.9339 41.2418 42.9365 39.1013V18.2213C42.9339 16.0808 41.1993 14.3463 39.0588 14.3437Z" fill="#B5E3D8"/>
        <path d="M44.1459 9.3271H26.8236L23.3789 5.23299C23.263 5.09369 23.0894 5.01557 22.9083 5.02122H8.94125C7.00572 5.0244 5.36902 6.45428 5.10596 8.37181H17.8448C18.5128 8.37016 19.147 8.66499 19.5765 9.17652L22 12.673H39.0589C42.1183 12.6782 44.5972 15.1571 44.6024 18.2165V37.9248C46.5422 37.6828 47.9985 36.0349 48.0001 34.08V13.2C47.995 11.0705 46.2754 9.34263 44.1459 9.3271Z" fill="#B5E3D8"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7634 19.6534C20.52 19.1805 21.4801 19.1805 22.2367 19.6534L27.2367 22.7784C27.919 23.2048 28.3334 23.9525 28.3334 24.757V31.2429C28.3334 32.0474 27.919 32.7952 27.2367 33.2215L22.2367 36.3465C21.4801 36.8194 20.52 36.8194 19.7634 36.3465L14.7634 33.2215C14.0812 32.7952 13.6667 32.0474 13.6667 31.2429V24.757C13.6667 23.9525 14.0812 23.2048 14.7634 22.7784L19.7634 19.6534ZM21.5301 20.784C21.2058 20.5814 20.7944 20.5814 20.4701 20.784L15.6195 23.8157L17.6668 25.0185L23.1504 21.7968L21.5301 20.784ZM24.4258 22.5939L18.9829 25.7917L21.0001 26.9768L26.3807 23.8157L24.4258 22.5939ZM27.0001 24.9982L21.6668 28.1316V35.1304L26.5301 32.0909C26.8225 31.9081 27.0001 31.5877 27.0001 31.2429V24.9982ZM20.3334 35.1305V28.1316L15.0001 24.9982V31.2429C15.0001 31.5877 15.1777 31.9081 15.4701 32.0909L20.3334 35.1305Z" fill="#F9FAFD"/>
        </svg>`,
        name: 'НПУ',
        subFoldersCount: 1,
        processesCount: 5,
        root: true,
        entities: ContentHelper.testEntities,
        type: CatalogEntityEnum.FOLDER
      },
      {
        id: 'npc',
        icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.0588 14.3437H21.7412L19.7841 11.2425C19.296 10.4691 18.4432 9.96448 17.5316 10.0378H3.85412C1.72094 10.0533 0 11.787 0 13.9201V39.1013C0.00258824 41.2418 1.73718 42.9764 3.87765 42.979H39.0588C41.1993 42.9764 42.9339 41.2418 42.9365 39.1013V18.2213C42.9339 16.0808 41.1993 14.3463 39.0588 14.3437Z" fill="#DCBFA6"/>
        <path d="M44.1459 9.3271H26.8236L23.3789 5.23299C23.263 5.09369 23.0894 5.01557 22.9083 5.02122H8.94125C7.00572 5.0244 5.36902 6.45428 5.10596 8.37181H17.8448C18.5128 8.37016 19.147 8.66499 19.5765 9.17652L22 12.673H39.0589C42.1183 12.6782 44.5972 15.1571 44.6024 18.2165V37.9248C46.5422 37.6828 47.9985 36.0349 48.0001 34.08V13.2C47.995 11.0705 46.2754 9.34263 44.1459 9.3271Z" fill="#DCBFA6"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.9241 24.2146C26.9241 23.9416 27.0821 23.8766 27.2741 24.0696L30.8561 27.6506C30.9485 27.7436 31.0003 27.8694 31.0003 28.0006C31.0003 28.1317 30.9485 28.2575 30.8561 28.3506L27.2741 31.9316C27.0821 32.1246 26.9241 32.0596 26.9241 31.7876V24.2146ZM17.0821 22.2086C16.8091 22.2086 16.7441 22.0516 16.9371 21.8586L20.6511 18.1446C20.7441 18.052 20.8699 18 21.0011 18C21.1323 18 21.2582 18.052 21.3511 18.1446L25.0641 21.8586C25.2561 22.0516 25.1911 22.2086 24.9191 22.2086H23.3901C23.1181 22.2086 22.9241 22.4576 22.9241 22.7286L22.9221 25.5036C22.9221 25.7776 22.6971 26.0036 22.4221 26.0036H19.6811C19.5487 26.003 19.4218 25.9502 19.3282 25.8565C19.2345 25.7629 19.1817 25.636 19.1811 25.5036L19.1911 22.7036C19.1909 22.5725 19.1388 22.4469 19.0462 22.3542C18.9537 22.2614 18.8282 22.2091 18.6971 22.2086H17.0821ZM14.8131 32.0186L11.1441 28.3506C11.0518 28.2575 11 28.1317 11 28.0006C11 27.8694 11.0518 27.7436 11.1441 27.6506L14.8141 23.9826C15.0061 23.7896 15.1641 23.8546 15.1641 24.1266V31.8746C15.1641 32.1466 15.0061 32.2116 14.8141 32.0196L14.8131 32.0186ZM22.4011 29.9746C22.6731 29.9746 22.9241 30.2146 22.9241 30.4866V33.3946C22.9241 33.6676 23.1181 33.8796 23.3901 33.8796H24.8321C25.1041 33.8796 25.1691 34.0366 24.9771 34.2296L21.3501 37.8566C21.2571 37.9489 21.1313 38.0007 21.0001 38.0007C20.869 38.0007 20.7432 37.9489 20.6501 37.8566L17.0231 34.2296C16.8301 34.0366 16.8961 33.8796 17.1681 33.8796H18.6971C18.8283 33.8793 18.9541 33.8271 19.0469 33.7343C19.1396 33.6415 19.1919 33.5158 19.1921 33.3846V30.4696C19.1921 30.1976 19.4151 29.9746 19.6871 29.9746H22.4001H22.4011Z" fill="#F9FAFD"/>
        </svg>`,
        name: 'НПЦ',
        subFoldersCount: 0,
        processesCount: 0,
        root: true,
        type: CatalogEntityEnum.FOLDER
      },
      {
        id: 'np-global',
        icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.0588 14.3437H21.7412L19.7841 11.2425C19.296 10.4691 18.4432 9.96448 17.5316 10.0378H3.85412C1.72094 10.0533 0 11.787 0 13.9201V39.1013C0.00258824 41.2418 1.73718 42.9764 3.87765 42.979H39.0588C41.1993 42.9764 42.9339 41.2418 42.9365 39.1013V18.2213C42.9339 16.0808 41.1993 14.3463 39.0588 14.3437Z" fill="#B6B8DC"/>
        <path d="M44.1459 9.3271H26.8236L23.3789 5.23299C23.263 5.09369 23.0894 5.01557 22.9083 5.02122H8.94125C7.00572 5.0244 5.36902 6.45428 5.10596 8.37181H17.8448C18.5128 8.37016 19.147 8.66499 19.5765 9.17652L22 12.673H39.0589C42.1183 12.6782 44.5972 15.1571 44.6024 18.2165V37.9248C46.5422 37.6828 47.9985 36.0349 48.0001 34.08V13.2C47.995 11.0705 46.2754 9.34263 44.1459 9.3271Z" fill="#B6B8DC"/>
        <path d="M27.3625 21.6375C23.8463 18.1211 18.1543 18.1206 14.6375 21.6375C11.1211 25.1538 11.1206 30.8457 14.6375 34.3625C18.1538 37.8789 23.8457 37.8794 27.3625 34.3625C30.8789 30.8462 30.8794 25.1543 27.3625 21.6375ZM26.9865 33.0799C26.566 32.704 26.1163 32.3713 25.6423 32.0846C25.9556 31.0023 26.1412 29.8114 26.1851 28.5734H28.8306C28.7109 30.2421 28.0698 31.8074 26.9865 33.0799ZM13.1694 28.5734H15.8149C15.8587 29.8114 16.0443 31.0023 16.3576 32.0846C15.8836 32.3713 15.4339 32.704 15.0135 33.0799C13.9302 31.8074 13.2891 30.2421 13.1694 28.5734ZM15.0136 22.9201C15.434 23.2961 15.8837 23.6287 16.3577 23.9155C16.0444 24.9977 15.8588 26.1886 15.8149 27.4266H13.1694C13.2891 25.758 13.9302 24.1926 15.0136 22.9201ZM20.4266 24.034C19.4915 23.9671 18.5898 23.7368 17.7538 23.3568C18.24 22.1049 19.1362 20.6033 20.4266 20.2312V24.034ZM20.4266 25.1829V27.4266H16.9622C17.0019 26.3794 17.1502 25.3738 17.397 24.4537C18.347 24.869 19.3686 25.117 20.4266 25.1829ZM20.4266 28.5734V30.8171C19.3686 30.8831 18.347 31.1311 17.397 31.5463C17.1502 30.6262 17.0019 29.6206 16.9622 28.5734H20.4266ZM20.4266 31.9661V35.7688C19.1363 35.3967 18.2401 33.8953 17.7538 32.6433C18.5898 32.2633 19.4915 32.033 20.4266 31.9661ZM21.5734 31.9661C22.5086 32.033 23.4103 32.2633 24.2462 32.6433C23.76 33.8952 22.8638 35.3967 21.5734 35.7688V31.9661ZM21.5734 30.8171V28.5734H25.0379C24.9982 29.6206 24.8498 30.6262 24.603 31.5463C23.6531 31.1311 22.6314 30.8831 21.5734 30.8171ZM21.5734 27.4266V25.1829C22.6314 25.117 23.6531 24.869 24.603 24.4537C24.8498 25.3738 24.9982 26.3794 25.0379 27.4266H21.5734ZM21.5734 24.034V20.2313C22.8638 20.6034 23.76 22.1049 24.2462 23.3568C23.4103 23.7368 22.5086 23.9671 21.5734 24.034ZM24.149 20.8037C24.8829 21.1252 25.5677 21.561 26.1816 22.1017C25.8894 22.3594 25.5811 22.593 25.2591 22.8019C24.9732 22.094 24.608 21.406 24.149 20.8037ZM16.7409 22.8019C16.4189 22.593 16.1106 22.3594 15.8184 22.1017C16.4323 21.561 17.117 21.1252 17.851 20.8037C17.392 21.4061 17.0268 22.0941 16.7409 22.8019ZM16.7409 33.1982C17.0268 33.906 17.392 34.594 17.8511 35.1963C17.1171 34.8749 16.4323 34.4391 15.8184 33.8983C16.1106 33.6407 16.4189 33.4071 16.7409 33.1982ZM25.2591 33.1982C25.5811 33.4071 25.8894 33.6407 26.1816 33.8983C25.5677 34.439 24.8829 34.8748 24.149 35.1963C24.608 34.594 24.9732 33.9061 25.2591 33.1982ZM26.1852 27.4266C26.1413 26.1887 25.9557 24.9977 25.6424 23.9155C26.1164 23.6288 26.566 23.2961 26.9865 22.9202C28.0698 24.1926 28.7109 25.758 28.8306 27.4266H26.1852Z" fill="#F9FAFD"/>
        </svg>`,
        name: 'NP Global',
        subFoldersCount: 0,
        processesCount: 0,
        root: true,
        type: CatalogEntityEnum.FOLDER
      },
      {
        id: 'post-finance',
        icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.0588 14.3437H21.7412L19.7841 11.2425C19.296 10.4691 18.4432 9.96448 17.5316 10.0378H3.85412C1.72094 10.0533 0 11.787 0 13.9201V39.1013C0.00258824 41.2418 1.73718 42.9764 3.87765 42.979H39.0588C41.1993 42.9764 42.9339 41.2418 42.9365 39.1013V18.2213C42.9339 16.0808 41.1993 14.3463 39.0588 14.3437Z" fill="#BDD6E6"/>
        <path d="M44.1459 9.3271H26.8236L23.3789 5.23299C23.263 5.09369 23.0894 5.01557 22.9083 5.02122H8.94125C7.00572 5.0244 5.36902 6.45428 5.10596 8.37181H17.8448C18.5128 8.37016 19.147 8.66499 19.5765 9.17652L22 12.673H39.0589C42.1183 12.6782 44.5972 15.1571 44.6024 18.2165V37.9248C46.5422 37.6828 47.9985 36.0349 48.0001 34.08V13.2C47.995 11.0705 46.2754 9.34263 44.1459 9.3271Z" fill="#BDD6E6"/>
        <path d="M28.6093 21.3107H13.3907C12.0724 21.3107 11 22.3832 11 23.7015V32.2989C11 33.6172 12.0724 34.6897 13.3907 34.6897H28.6093C29.9275 34.6897 31 33.6172 31 32.2989V23.7015C31 22.3832 29.9275 21.3107 28.6093 21.3107ZM29.6772 32.2989C29.6772 32.8878 29.1981 33.3668 28.6093 33.3668H13.3907C12.8019 33.3668 12.3228 32.8878 12.3228 32.2989V26.5374H29.6771L29.6772 32.2989ZM29.6772 24.6502L12.3228 24.6514V23.7014C12.3228 23.1126 12.8019 22.6335 13.3908 22.6335H28.6093C29.1981 22.6335 29.6772 23.1126 29.6772 23.7014V24.6502Z" fill="#F9FAFD"/>
        <path d="M13.9646 32.1401H17.5859C17.7156 32.1401 17.8208 32.035 17.8208 31.9054V31.1909C17.8208 31.0612 17.7156 30.9561 17.5859 30.9561H13.9646C13.8349 30.9561 13.7297 31.0612 13.7297 31.1909V31.9054C13.7297 32.035 13.8349 32.1401 13.9646 32.1401Z" fill="#F9FAFD"/>
        <path d="M24.5907 28.8353C24.967 28.8353 25.3139 28.9613 25.5917 29.1732C25.8695 28.9614 26.2162 28.8353 26.5926 28.8353C27.5053 28.8353 28.2451 29.5751 28.2451 30.4877C28.2451 31.4003 27.5052 32.1401 26.5926 32.1401C26.2163 32.1401 25.8695 32.0141 25.5917 31.8021C25.3139 32.014 24.9671 32.1401 24.5907 32.1401C23.678 32.1401 22.9382 31.4003 22.9382 30.4877C22.9382 29.5751 23.6781 28.8353 24.5907 28.8353Z" fill="#F9FAFD"/>
        </svg>`,
        name: 'Пост-Фінанс',
        subFoldersCount: 0,
        processesCount: 0,
        root: true,
        type: CatalogEntityEnum.FOLDER
      }
    ];
  }

  public static get testEntities(): CatalogEntityModel[] {
    const participants = ContentHelper.getEmployees(3);
    return [
      {
        id: '701431a7-21da-468d-9fc3-cc290a13a927',
        name: 'folder_1',
        participants,
        type: CatalogEntityEnum.FOLDER,
        owner: participants[0],
        lastUpdated: new Date(),
        permissions: CatalogEntityPermissionEnum.VIEWER,
        entities: [
          {
            id: '701431a7-21da-468d-9fc3-cc290a13a141',
            name: 'folder_1_1',
            participants,
            type: CatalogEntityEnum.FOLDER,
            owner: participants[0],
            lastUpdated: new Date(),
            permissions: CatalogEntityPermissionEnum.VIEWER,
            entities: [
              {
                id: '701431a7-21da-468d-9fc3-cc290a13a241',
                name: 'folder_1_1_1',
                participants,
                type: CatalogEntityEnum.FOLDER,
                owner: participants[0],
                lastUpdated: new Date(),
                permissions: CatalogEntityPermissionEnum.VIEWER
              }
            ]
          },
          {
            id: '701431a7-21da-468d-9fc3-cc290a13a142',
            name: 'folder_1_2',
            participants,
            type: CatalogEntityEnum.FOLDER,
            owner: participants[0],
            lastUpdated: new Date(),
            permissions: CatalogEntityPermissionEnum.VIEWER
          },
          {
            id: '701431a7-21da-468d-9fc3-cc290a13a143',
            name: 'folder_1_3',
            participants,
            type: CatalogEntityEnum.FOLDER,
            owner: participants[0],
            lastUpdated: new Date(),
            permissions: CatalogEntityPermissionEnum.VIEWER
          }
        ]
      },
      {
        id: '3640a200-269a-4a08-bbea-0b12f7cf5ffc',
        name: 'Основные элементы',
        participants,
        type: CatalogEntityEnum.PROCESS,
        owner: participants[0],
        lastUpdated: new Date(),
        status: NpStatusPillEnum.DRAFT,
        link: '../../../assets/bpmn/main-elements.bpmn',
        permissions: CatalogEntityPermissionEnum.EDITOR
      },
      {
        id: 'e2c2c26a-e573-417b-802b-86135afbc5da',
        name: 'Переадрессация посылки v17',
        participants,
        type: CatalogEntityEnum.PROCESS,
        owner: participants[0],
        lastUpdated: new Date(),
        status: NpStatusPillEnum.DRAFT,
        link: '../../../assets/bpmn/forwarding-parcels-v17.bpmn',
        permissions: CatalogEntityPermissionEnum.EDITOR
      },
      {
        id: 'e74e4dd2-cb68-496f-9991-c344d16dd639',
        name: 'Создание ЕН_v11',
        participants,
        type: CatalogEntityEnum.PROCESS,
        owner: participants[0],
        lastUpdated: new Date(),
        status: NpStatusPillEnum.DRAFT,
        link: '../../../assets/bpmn/creation-of-EN_v11.bpmn',
        permissions: CatalogEntityPermissionEnum.EDITOR
      },
      {
        id: 'e74e4dd2-cb68-496f-9991-c344d16dd777',
        name: 'Токены',
        participants,
        type: CatalogEntityEnum.PROCESS,
        owner: participants[0],
        lastUpdated: new Date(),
        status: NpStatusPillEnum.DRAFT,
        link: '../../../assets/bpmn/tokens.bpmn',
        permissions: CatalogEntityPermissionEnum.EDITOR
      },
      {
        id: 'e74e4dd2-cb68-496f-9991-c344d16dd228',
        name: 'token-example',
        participants,
        type: CatalogEntityEnum.PROCESS,
        owner: participants[0],
        lastUpdated: new Date(),
        status: NpStatusPillEnum.DRAFT,
        link: '../../../assets/bpmn/token-example.bpmn',
        permissions: CatalogEntityPermissionEnum.NO_ACCESS
      }
    ];
  }

  public static getEmployees(count: number = 1): EmployeeModel[] {
    const employees: EmployeeModel[] = [];
    for (let i = 0; i < count; i++) {
      employees.push({
        id: uuidv4(),
        firstName: ContentHelper.randomFirstName,
        lastName: ContentHelper.randomLastName
      });
    }
    return employees;
  }

  public static get randomFirstName(): string {
    const names = ['Владислав', 'Олег', 'Артем', 'Микола', 'Євген', 'Степан', 'Ілля', 'Денис', 'Віталій'];
    return names[Math.floor(Math.random() * names.length)];
  }

  public static get randomLastName(): string {
    const names = ['Смірнов', 'Філіппов', 'Мазур', 'Даскін', 'Умеренко', 'Калашніков', 'Бондаренко'];
    return names[Math.floor(Math.random() * names.length)];
  }

  public static getVersions(type: HistoryTypeEnum): SearchModel<ProcessVersionModel> {
    const items: ProcessVersionModel[] = [];
    for (let i = 0; i < 10; i++) {
      if (type === HistoryTypeEnum.VERSION_HISTORY) {
        items.push({
          id: uuidv4(),
          name: `Версія ${i}`,
          desc: 'Додав флоу с помилками',
          user: {
            username: 'test.test',
            email: 'gryshyn.vv@novaposhta.ua',
            firstName: ContentHelper.randomFirstName,
            middleName: 'Вячеславович',
            lastName: ContentHelper.randomLastName
          },
          date: new Date(),
          launched: i === 3,
          active: !i
        });
      } else if (type === HistoryTypeEnum.START_AND_STOP_HISTORY) {
        items.push({
          id: uuidv4(),
          name: i % 3 === 0 ? `Зупинка “Версія ${i}”` : `Старт “Версія ${i}”`,
          user: {
            username: 'test.test',
            email: 'gryshyn.vv@novaposhta.ua',
            firstName: ContentHelper.randomFirstName,
            middleName: 'Вячеславович',
            lastName: ContentHelper.randomLastName
          },
          date: new Date()
        });
      }
    }
    return {
      items,
      count: items.length
    };
  }

}
