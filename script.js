const SUPABASE_URL = "https://yawxydwdrfmlpsymgqbq.supabase.co";
const SUPABASE_KEY = "sb_publishable_E8hzSOWCNWUU2ds65v1RXQ_muZMbzq2";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const cards = document.querySelectorAll(".card, .course");
const backBtn = document.querySelector(".back");
const ratingList = document.getElementById("ratingList");
const lessons = {
  domain: {
    title: "CLOUD BASICS",
    text: "Azure, AWS, Virtual Machines, Microsoft 365 and modern cloud infrastructure."
  },
  mikrotik: {
    title: "MikroTik",
    text: "В этом разделе будет обучение по MikroTik: настройка IP-адресов, DHCP, NAT, firewall, маршрутизация и базовая защита сети."
  },
  server: {
    title: "Windows Server",
    text: "Здесь будет обучение по Windows Server: роли сервера, DNS, DHCP, GPO, управление пользователями, группами и компьютерами."
  },
  security: {
    title: "Security",
    text: "Здесь будет обучение по безопасности: права пользователей, пароли, доступы, защита сети, firewall и базовые правила администрирования."
  }
};
const cloudBasicsContent = `
  <div class="lesson-content">
    <p class="lesson-intro">Azure, AWS, Virtual Machines, Microsoft 365 and modern cloud infrastructure.</p>

    <section class="lesson-section">
      <h2>☁️ AZURE</h2>
      <h3>Description:</h3>
      <p>Microsoft cloud platform for business infrastructure.</p>
      <h3>Что это означает:</h3>
      <p>Azure — это облачная платформа Microsoft, которая позволяет создавать серверы, сайты, базы данных, сети и целые корпоративные системы через интернет.</p>
      <h3>Простыми словами:</h3>
      <p>Это как огромный дата-центр Microsoft, только ты арендуешь его через интернет и можешь запускать там свои серверы и сервисы.</p>
    </section>

    <section class="lesson-section">
      <h2>☁️ Azure Virtual Machines</h2>
      <h3>Что это означает:</h3>
      <p>Виртуальные серверы Windows или Linux внутри Azure.</p>
      <h3>Простыми словами:</h3>
      <p>Ты создаёшь компьютер в облаке и можешь подключаться к нему из любой точки мира.</p>
    </section>

    <section class="lesson-section">
      <h2>💾 Azure Storage</h2>
      <h3>Что это означает:</h3>
      <p>Система хранения файлов, данных и резервных копий.</p>
      <h3>Простыми словами:</h3>
      <p>Это облачная флешка или жёсткий диск Microsoft для хранения информации.</p>
    </section>

    <section class="lesson-section">
      <h2>🌐 Azure Networking</h2>
      <h3>Что это означает:</h3>
      <p>Настройка сетей, IP-адресов и соединений между серверами.</p>
      <h3>Простыми словами:</h3>
      <p>Это как создание интернета внутри твоей облачной инфраструктуры.</p>
    </section>

    <section class="lesson-section">
      <h2>🛡 Entra ID</h2>
      <h3>Что это означает:</h3>
      <p>Система управления пользователями и входом в сервисы.</p>
      <h3>Простыми словами:</h3>
      <p>Она проверяет кто ты, какой у тебя доступ и что тебе можно открывать.</p>
    </section>

    <section class="lesson-section">
      <h2>🔐 Azure Security</h2>
      <h3>Что это означает:</h3>
      <p>Инструменты защиты облачной инфраструктуры.</p>
      <h3>Простыми словами:</h3>
      <p>Это защита серверов и данных от взломов, вирусов и утечек.</p>
    </section>

    <section class="lesson-section">
      <h2>📦 Resource Groups</h2>
      <h3>Что это означает:</h3>
      <p>Группы для объединения ресурсов проекта.</p>
      <h3>Простыми словами:</h3>
      <p>Это как папка, в которой лежат все серверы, сети и сервисы одного проекта.</p>
    </section>

    <section class="lesson-section">
      <h2>☁️ AWS BASICS</h2>
      <h3>Description:</h3>
      <p>Amazon cloud services and infrastructure basics.</p>
      <h3>Что это означает:</h3>
      <p>AWS — это облачная платформа Amazon для создания серверов, хранения данных и запуска IT-инфраструктуры.</p>
      <h3>Простыми словами:</h3>
      <p>Ты арендуешь мощность серверов Amazon вместо покупки своих компьютеров.</p>
    </section>

    <section class="lesson-section">
      <h2>🖥 EC2</h2>
      <h3>Что это означает:</h3>
      <p>Сервис виртуальных серверов AWS.</p>
      <h3>Простыми словами:</h3>
      <p>Ты запускаешь сервер через интернет за несколько минут.</p>
    </section>

    <section class="lesson-section">
      <h2>💾 S3 Storage</h2>
      <h3>Что это означает:</h3>
      <p>Облачное хранилище файлов.</p>
      <h3>Простыми словами:</h3>
      <p>Это место, где можно хранить фотографии, документы, сайты и резервные копии.</p>
    </section>

    <section class="lesson-section">
      <h2>🌍 Cloud Networking</h2>
      <h3>Что это означает:</h3>
      <p>Настройка сетей и подключения серверов.</p>
      <h3>Простыми словами:</h3>
      <p>Это соединение серверов между собой через облачную сеть.</p>
    </section>

    <section class="lesson-section">
      <h2>🔐 AWS Security</h2>
      <h3>Что это означает:</h3>
      <p>Система безопасности AWS.</p>
      <h3>Простыми словами:</h3>
      <p>Она защищает серверы, данные и аккаунты от атак.</p>
    </section>

    <section class="lesson-section">
      <h2>📊 AWS Console</h2>
      <h3>Что это означает:</h3>
      <p>Главная панель управления AWS.</p>
      <h3>Простыми словами:</h3>
      <p>Это сайт, через который ты управляешь всеми облачными сервисами Amazon.</p>
    </section>

    <section class="lesson-section">
      <h2>💻 VIRTUAL MACHINES</h2>
      <h3>Description:</h3>
      <p>Learn how virtual computers work inside one physical machine.</p>
      <h3>Что это означает:</h3>
      <p>Виртуальная машина — это отдельный компьютер внутри другого компьютера.</p>
      <h3>Простыми словами:</h3>
      <p>Ты можешь запускать Windows или Linux прямо внутри своего ПК как отдельную систему.</p>
    </section>

    <section class="lesson-section">
      <h2>🖥 VirtualBox</h2>
      <h3>Что это означает:</h3>
      <p>Программа для создания виртуальных машин.</p>
      <h3>Простыми словами:</h3>
      <p>Она позволяет запускать другие операционные системы внутри твоего компьютера.</p>
    </section>

    <section class="lesson-section">
      <h2>⚙ VMware</h2>
      <h3>Что это означает:</h3>
      <p>Профессиональная система виртуализации.</p>
      <h3>Простыми словами:</h3>
      <p>Это более мощный инструмент для работы с виртуальными серверами и лабораториями.</p>
    </section>

    <section class="lesson-section">
      <h2>📸 Snapshots</h2>
      <h3>Что это означает:</h3>
      <p>Сохранение состояния виртуальной машины.</p>
      <h3>Простыми словами:</h3>
      <p>Ты можешь сохранить систему и потом откатить её назад как сохранение в игре.</p>
    </section>

    <section class="lesson-section">
      <h2>🌐 Virtual Networks</h2>
      <h3>Что это означает:</h3>
      <p>Соединение виртуальных машин в сеть.</p>
      <h3>Простыми словами:</h3>
      <p>Виртуальные компьютеры могут общаться друг с другом как настоящие устройства.</p>
    </section>

    <section class="lesson-section">
      <h2>🏢 MICROSOFT 365</h2>
      <h3>Description:</h3>
      <p>Business productivity and collaboration platform.</p>
      <h3>Что это означает:</h3>
      <p>Microsoft 365 — это рабочая экосистема Microsoft для компаний.</p>
      <h3>Простыми словами:</h3>
      <p>Там находятся почта, Teams, документы, облако и всё для работы сотрудников.</p>
    </section>

    <section class="lesson-section">
      <h2>📧 Outlook</h2>
      <h3>Что это означает:</h3>
      <p>Корпоративная электронная почта.</p>
      <h3>Простыми словами:</h3>
      <p>Это рабочая почта компании.</p>
    </section>

    <section class="lesson-section">
      <h2>💬 Teams</h2>
      <h3>Что это означает:</h3>
      <p>Платформа для общения и звонков.</p>
      <h3>Простыми словами:</h3>
      <p>Это корпоративный Discord или Zoom для сотрудников.</p>
    </section>

    <section class="lesson-section">
      <h2>☁️ OneDrive</h2>
      <h3>Что это означает:</h3>
      <p>Облачное хранилище Microsoft.</p>
      <h3>Простыми словами:</h3>
      <p>Ты сохраняешь файлы в интернете и можешь открыть их с любого устройства.</p>
    </section>

    <section class="lesson-section">
      <h2>🏢 SharePoint</h2>
      <h3>Что это означает:</h3>
      <p>Система корпоративных сайтов и документов.</p>
      <h3>Простыми словами:</h3>
      <p>Это внутренний сайт компании для хранения информации и файлов.</p>
    </section>

    <section class="lesson-section">
      <h2>⚙ Admin Center</h2>
      <h3>Что это означает:</h3>
      <p>Главная панель администратора Microsoft 365.</p>
      <h3>Простыми словами:</h3>
      <p>Через неё IT-администратор управляет всей компанией.</p>
    </section>

    <section class="lesson-section">
      <h2>🛡 ENTRA ID</h2>
      <h3>Description:</h3>
      <p>Identity and access management system.</p>
      <h3>Что это означает:</h3>
      <p>Entra ID управляет пользователями, входом и безопасностью аккаунтов.</p>
      <h3>Простыми словами:</h3>
      <p>Она проверяет кто входит в систему и к чему у него есть доступ.</p>
    </section>

    <section class="lesson-section">
      <h2>👤 Users</h2>
      <h3>Что это означает:</h3>
      <p>Создание и управление пользователями.</p>
      <h3>Простыми словами:</h3>
      <p>Добавление сотрудников в систему.</p>
    </section>

    <section class="lesson-section">
      <h2>👥 Groups</h2>
      <h3>Что это означает:</h3>
      <p>Группы пользователей.</p>
      <h3>Простыми словами:</h3>
      <p>Можно выдавать доступ сразу нескольким людям одновременно.</p>
    </section>

    <section class="lesson-section">
      <h2>🔐 MFA</h2>
      <h3>Что это означает:</h3>
      <p>Многофакторная аутентификация.</p>
      <h3>Простыми словами:</h3>
      <p>Дополнительная защита аккаунта через телефон или код.</p>
    </section>

    <section class="lesson-section">
      <h2>🚪 Conditional Access</h2>
      <h3>Что это означает:</h3>
      <p>Правила доступа к системе.</p>
      <h3>Простыми словами:</h3>
      <p>Можно ограничить вход по стране, устройству или времени.</p>
    </section>

    <section class="lesson-section">
      <h2>🛡 Identity Protection</h2>
      <h3>Что это означает:</h3>
      <p>Защита аккаунтов от подозрительной активности.</p>
      <h3>Простыми словами:</h3>
      <p>Система ищет взломы и подозрительные входы.</p>
    </section>
  </div>
`;

const mikrotikBasicsContent = `
  <div class="lesson-content">
    <p class="lesson-intro">RouterOS, routing, firewall, VPN, VLAN, Wi-Fi and professional network administration.</p>

    <section class="lesson-section">
      <h2>🌐 MIKROTIK</h2>
      <h3>Что это означает:</h3>
      <p>MikroTik — это оборудование и операционная система RouterOS для профессиональной настройки сетей, маршрутизации и интернет-инфраструктуры. Используется в офисах, дата-центрах, провайдерах и корпоративных сетях для управления интернетом, безопасностью и сетевым трафиком. MikroTik поддерживает VPN, firewall, VLAN, Wi-Fi и расширенные сетевые технологии.</p>
      <h3>Простыми словами:</h3>
      <p>Это профессиональный роутер и система управления сетью для интернета, Wi-Fi и безопасности.</p>
    </section>

    <section class="lesson-section">
      <h2>🛜 ADVANCED ROUTER SETUP</h2>
      <h3>Что это означает:</h3>
      <p>Advanced Router Setup включает полную настройку маршрутизатора, сетевых интерфейсов, интернет-подключения и безопасности. Администратор настраивает IP-адреса, DHCP, DNS, firewall и правила маршрутизации для стабильной работы сети. Такие настройки используются в домашних, офисных и корпоративных инфраструктурах.</p>
      <h3>Простыми словами:</h3>
      <p>Полная профессиональная настройка роутера и интернета.</p>
    </section>

    <section class="lesson-section">
      <h2>🌐 STATIC IP ADDRESS</h2>
      <h3>Что это означает:</h3>
      <p>Static IP Address — это постоянный сетевой адрес устройства, который не изменяется автоматически. Такой IP используется для серверов, камер видеонаблюдения, VPN и удалённого подключения к устройствам. Статические адреса обеспечивают стабильность сетевых сервисов.</p>
      <h3>Простыми словами:</h3>
      <p>Постоянный адрес устройства в сети.</p>
    </section>

    <section class="lesson-section">
      <h2>🔄 DYNAMIC IP ADDRESS</h2>
      <h3>Что это означает:</h3>
      <p>Dynamic IP Address автоматически назначается устройству DHCP-сервером или интернет-провайдером. Такой IP может изменяться при повторном подключении к сети или перезагрузке устройства. Динамические адреса упрощают управление сетью и массовое подключение устройств.</p>
      <h3>Простыми словами:</h3>
      <p>IP-адрес, который может автоматически меняться.</p>
    </section>

    <section class="lesson-section">
      <h2>📥 DHCP SERVER</h2>
      <h3>Что это означает:</h3>
      <p>DHCP Server автоматически выдаёт IP-адреса, DNS и сетевые параметры всем устройствам внутри сети. Благодаря DHCP администраторам не нужно вручную настраивать каждое устройство отдельно. Это значительно упрощает подключение компьютеров, телефонов и серверов к интернету.</p>
      <h3>Простыми словами:</h3>
      <p>Роутер сам раздаёт интернет и сетевые настройки.</p>
    </section>

    <section class="lesson-section">
      <h2>📤 DHCP CLIENT</h2>
      <h3>Что это означает:</h3>
      <p>DHCP Client — это устройство или система, которая автоматически получает IP-адрес и сетевые параметры от DHCP-сервера. DHCP Client используется практически на всех компьютерах, телефонах и ноутбуках. Это позволяет быстро подключаться к интернету без ручной настройки сети.</p>
      <h3>Простыми словами:</h3>
      <p>Устройство автоматически получает интернет от роутера.</p>
    </section>

    <section class="lesson-section">
      <h2>🌍 DNS SERVER</h2>
      <h3>Что это означает:</h3>
      <p>DNS Server преобразует названия сайтов и сервисов в IP-адреса, понятные сетевым устройствам. DNS используется для доступа к сайтам, облачным сервисам и внутренним корпоративным системам. Без DNS пользователям пришлось бы вводить IP-адреса вручную.</p>
      <h3>Простыми словами:</h3>
      <p>DNS помогает открыть сайт по его названию.</p>
    </section>

    <section class="lesson-section">
      <h2>🧩 ROUTING TABLES</h2>
      <h3>Что это означает:</h3>
      <p>Routing Tables содержат информацию о маршрутах передачи сетевого трафика между различными сетями. Роутер использует эти таблицы для определения лучшего пути доставки данных. Маршруты могут быть статическими или динамическими.</p>
      <h3>Простыми словами:</h3>
      <p>Таблица маршрутов для передачи интернет-трафика.</p>
    </section>

    <section class="lesson-section">
      <h2>🌐 DYNAMIC ROUTING</h2>
      <h3>Что это означает:</h3>
      <p>Dynamic Routing автоматически обновляет маршруты между роутерами без ручного вмешательства администратора. Это помогает сети быстро адаптироваться к изменениям и отказам оборудования. Используется в крупных корпоративных и провайдерских сетях.</p>
      <h3>Простыми словами:</h3>
      <p>Роутеры сами находят лучший путь для интернета.</p>
    </section>

    <section class="lesson-section">
      <h2>📡 OSPF ROUTING</h2>
      <h3>Что это означает:</h3>
      <p>OSPF — это протокол динамической маршрутизации, который помогает роутерам обмениваться информацией о сети. Он автоматически рассчитывает наиболее эффективный маршрут передачи данных. OSPF широко используется в enterprise-инфраструктуре.</p>
      <h3>Простыми словами:</h3>
      <p>Система, которая помогает роутерам правильно передавать трафик.</p>
    </section>

    <section class="lesson-section">
      <h2>🔀 LOAD BALANCING</h2>
      <h3>Что это означает:</h3>
      <p>Load Balancing распределяет интернет-нагрузку между несколькими каналами связи или серверами. Это повышает стабильность сети, производительность и отказоустойчивость инфраструктуры. Часто используется при наличии нескольких интернет-провайдеров.</p>
      <h3>Простыми словами:</h3>
      <p>Распределение интернета между несколькими подключениями.</p>
    </section>

    <section class="lesson-section">
      <h2>🛡 FIREWALL RULES</h2>
      <h3>Что это означает:</h3>
      <p>Firewall Rules контролируют входящий и исходящий сетевой трафик на основе заданных правил безопасности. Они позволяют блокировать подозрительные подключения, ограничивать доступ и защищать инфраструктуру от атак. Firewall является одной из основных систем сетевой безопасности.</p>
      <h3>Простыми словами:</h3>
      <p>Правила защиты сети и фильтрации подключений.</p>
    </section>

    <section class="lesson-section">
      <h2>🚫 DDOS PROTECTION</h2>
      <h3>Что это означает:</h3>
      <p>DDoS Protection защищает сеть и серверы от массовых атак, перегружающих интернет-каналы и оборудование. Система анализирует подозрительный трафик и автоматически блокирует вредоносные подключения. Это помогает поддерживать стабильную работу сервисов.</p>
      <h3>Простыми словами:</h3>
      <p>Защита сети от перегрузок и интернет-атак.</p>
    </section>

    <section class="lesson-section">
      <h2>🔒 PORT SECURITY</h2>
      <h3>Что это означает:</h3>
      <p>Port Security ограничивает и контролирует подключения к сетевым портам роутеров и коммутаторов. Это предотвращает подключение неавторизованных устройств и повышает безопасность сети. Часто используется в корпоративной инфраструктуре.</p>
      <h3>Простыми словами:</h3>
      <p>Контроль того, какие устройства могут подключаться к сети.</p>
    </section>

    <section class="lesson-section">
      <h2>🔐 VPN TUNNELING</h2>
      <h3>Что это означает:</h3>
      <p>VPN Tunneling создаёт защищённый зашифрованный канал передачи данных через интернет. Такая технология используется для безопасной удалённой работы и подключения к корпоративным сетям. VPN скрывает трафик и защищает данные пользователей.</p>
      <h3>Простыми словами:</h3>
      <p>Безопасный интернет-туннель для подключения к сети.</p>
    </section>

    <section class="lesson-section">
      <h2>🌍 SITE-TO-SITE VPN</h2>
      <h3>Что это означает:</h3>
      <p>Site-to-Site VPN соединяет две удалённые сети через интернет в одну защищённую инфраструктуру. Это позволяет филиалам компании работать как единая локальная сеть. Передача данных между офисами шифруется и защищается.</p>
      <h3>Простыми словами:</h3>
      <p>Соединение двух офисов через защищённый интернет.</p>
    </section>

    <section class="lesson-section">
      <h2>📶 WIRELESS SECURITY</h2>
      <h3>Что это означает:</h3>
      <p>Wireless Security включает защиту Wi-Fi сети от взломов, несанкционированного доступа и атак. Используются пароли, шифрование, фильтрация устройств и системы безопасности. Это помогает защищать пользователей и данные внутри сети.</p>
      <h3>Простыми словами:</h3>
      <p>Защита Wi-Fi и беспроводного интернета.</p>
    </section>

    <section class="lesson-section">
      <h2>📡 ACCESS POINTS</h2>
      <h3>Что это означает:</h3>
      <p>Access Points используются для расширения покрытия беспроводной сети и подключения устройств к Wi-Fi. Они помогают создавать стабильную сеть в больших офисах, домах и предприятиях. Точки доступа работают совместно с роутерами и контроллерами сети.</p>
      <h3>Простыми словами:</h3>
      <p>Устройства для расширения зоны Wi-Fi.</p>
    </section>

    <section class="lesson-section">
      <h2>🌐 VLAN</h2>
      <h3>Что это означает:</h3>
      <p>VLAN позволяет разделять одну физическую сеть на несколько виртуальных сетей. Это помогает изолировать пользователей, повышать безопасность и упрощать управление инфраструктурой. VLAN активно используется в корпоративных сетях.</p>
      <h3>Простыми словами:</h3>
      <p>Разделение одной сети на несколько отдельных сетей.</p>
    </section>

    <section class="lesson-section">
      <h2>📶 NETWORK BRIDGES</h2>
      <h3>Что это означает:</h3>
      <p>Network Bridges объединяют несколько сетевых интерфейсов или сегментов сети в одну общую инфраструктуру. Bridges используются для упрощения подключения устройств и передачи трафика между сетями. Это помогает строить гибкие сетевые схемы.</p>
      <h3>Простыми словами:</h3>
      <p>Соединение нескольких сетей или портов в одну.</p>
    </section>

    <section class="lesson-section">
      <h2>⚡ BANDWIDTH CONTROL</h2>
      <h3>Что это означает:</h3>
      <p>Bandwidth Control управляет скоростью интернет-трафика для пользователей, сервисов и приложений. Администратор может ограничивать или распределять интернет для предотвращения перегрузки сети. Это помогает поддерживать стабильную работу инфраструктуры.</p>
      <h3>Простыми словами:</h3>
      <p>Контроль и ограничение скорости интернета.</p>
    </section>

    <section class="lesson-section">
      <h2>📊 TRAFFIC ANALYTICS</h2>
      <h3>Что это означает:</h3>
      <p>Traffic Analytics анализирует сетевой трафик, активность пользователей и использование интернет-ресурсов. Это помогает выявлять перегрузки, проблемы безопасности и подозрительную активность внутри сети. Мониторинг используется для оптимизации инфраструктуры.</p>
      <h3>Простыми словами:</h3>
      <p>Анализ кто и как использует интернет.</p>
    </section>

    <section class="lesson-section">
      <h2>👥 HOTSPOT AUTHENTICATION</h2>
      <h3>Что это означает:</h3>
      <p>Hotspot Authentication создаёт систему авторизации пользователей перед подключением к Wi-Fi сети. Пользователи проходят вход через специальную страницу с логином, паролем или кодом доступа. Такая технология часто используется в кафе, отелях и офисах.</p>
      <h3>Простыми словами:</h3>
      <p>Страница входа в Wi-Fi сеть.</p>
    </section>

    <section class="lesson-section">
      <h2>🖥 REMOTE ADMINISTRATION</h2>
      <h3>Что это означает:</h3>
      <p>Remote Administration позволяет управлять роутерами и сетевым оборудованием через интернет из любой точки мира. Администратор может изменять настройки, обновлять систему и диагностировать проблемы удалённо. Это важно для поддержки корпоративных сетей.</p>
      <h3>Простыми словами:</h3>
      <p>Удалённое управление сетью через интернет.</p>
    </section>

    <section class="lesson-section">
      <h2>📈 NETWORK MONITORING</h2>
      <h3>Что это означает:</h3>
      <p>Network Monitoring используется для постоянного контроля состояния сети, оборудования и интернет-подключения. Система отслеживает нагрузку, ошибки, доступность устройств и стабильность соединения. Это помогает быстро находить и устранять проблемы.</p>
      <h3>Простыми словами:</h3>
      <p>Постоянная проверка работы сети и интернета.</p>
    </section>

    <section class="lesson-section">
      <h2>🛠 TROUBLESHOOTING</h2>
      <h3>Что это означает:</h3>
      <p>Troubleshooting — это процесс диагностики и устранения сетевых проблем, ошибок подключения и неисправностей оборудования. Администратор анализирует трафик, настройки и состояние сети для поиска причины проблемы. Это один из главных навыков системного администратора.</p>
      <h3>Простыми словами:</h3>
      <p>Поиск причин, почему не работает сеть или интернет.</p>
    </section>
  </div>
`;
async function getUsers() {
  const { data, error } = await db
    .from("green_y_users")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

function getUserRegions() {
  return JSON.parse(localStorage.getItem("greenYUserRegions")) || {};
}

function saveUserRegions(regions) {
  localStorage.setItem("greenYUserRegions", JSON.stringify(regions));
}

function getUserRating(username) {
  const results = getTestResults();

  const userResult = results.find(
    result =>
      result.username === username &&
      result.testId === "first-test"
  );

  if (!userResult) return 0;

  return userResult.percent;
}

async function renderUsers() {
  const tableBodies = [ratingList].filter(Boolean);
  if (tableBodies.length === 0) return;

  const users = await getUsers();
  const regions = getUserRegions();

  tableBodies.forEach(tableBody => {
    tableBody.innerHTML = "";
  });

  if (users.length === 0) {
    tableBodies.forEach(tableBody => {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">No users yet.</td>
        </tr>
      `;
    });
    return;
  }

  const ratingUsers = users.map(user => ({
    username: user.username,
    region: regions[user.username] || user.region || "SD",
    rating: getUserRating(user.username)
  }));

  ratingUsers.sort((a, b) => b.rating - a.rating);

  tableBodies.forEach(tableBody => {
    ratingUsers.forEach((user, index) => {
      const row = document.createElement("tr");

      const trophy =
        index === 0 ? "🏆" :
        index === 1 ? "🥈" :
        index === 2 ? "🥉" :
        "";

      row.innerHTML = `
        <td>
          <span class="rating-position">
            ${trophy} ${index + 1}
          </span>
        </td>

        <td>
          <span class="talent-name">
            👤 ${user.username}
          </span>
        </td>

        <td>
          <select class="region-select" data-username="${user.username}">
            <option value="SD" ${user.region === "SD" ? "selected" : ""}>SD</option>
            <option value="PC" ${user.region === "PC" ? "selected" : ""}>PC</option>
            <option value="COL" ${user.region === "COL" ? "selected" : ""}>COL</option>
          </select>
        </td>

        <td>
          <span class="rating-score">
            ${user.rating}
          </span>
        </td>
      `;

      tableBody.appendChild(row);
    });
  });

  document.querySelectorAll(".region-select").forEach(select => {
    select.addEventListener("change", () => {
      const username = select.dataset.username;
      const regions = getUserRegions();
      regions[username] = select.value;
      saveUserRegions(regions);
    });
  });
}
function renderRating() {
  renderUsers();
}
  
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const pageId = item.dataset.page;

    menuItems.forEach(btn => btn.classList.remove("active"));
    item.classList.add("active");

    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    if (pageId === "tests") {
  renderRating();
}
  });
});

cards.forEach(card => {
  card.addEventListener("click", () => {
    const topic = card.dataset.topic;
    if (!topic) return;

    pages.forEach(page => page.classList.remove("active"));

    document.getElementById("lessonTitle").textContent = lessons[topic].title;
    document.getElementById("lessonText").innerHTML =
      topic === "domain" ? cloudBasicsContent :
      topic === "mikrotik" ? mikrotikBasicsContent :
      lessons[topic].text;

    document.getElementById("lesson").classList.add("active");
  });
});

backBtn.addEventListener("click", () => {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById("home").classList.add("active");
});

renderUsers();
const discussionTabsContainer = document.querySelector(".discussion-tabs");
const commentUser = document.getElementById("commentUser");
const commentText = document.getElementById("commentText");
const sendComment = document.getElementById("sendComment");
const commentsList = document.getElementById("commentsList");

const newTopicInput = document.getElementById("newTopicInput");
const addTopicBtn = document.getElementById("addTopicBtn");

let activeDiscussionTopic = "domain";

const defaultTopics = [
  { id: "domain", name: "Domain" },
  { id: "mikrotik", name: "MikroTik" },
  { id: "server", name: "Windows Server" },
  { id: "security", name: "Security" }
];

function getTopics() {
  const savedTopics = JSON.parse(localStorage.getItem("greenYTopics"));

  if (!savedTopics) {
    localStorage.setItem("greenYTopics", JSON.stringify(defaultTopics));
    return defaultTopics;
  }

  return savedTopics;
}

function saveTopics(topics) {
  localStorage.setItem("greenYTopics", JSON.stringify(topics));
}

function createTopicId(topicName) {
  return topicName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");
}

function renderTopics() {
  const topics = getTopics();

  discussionTabsContainer.innerHTML = "";

  topics.forEach(topic => {
    const button = document.createElement("button");
    button.className = "discussion-tab";
    button.textContent = topic.name;
    button.dataset.topic = topic.id;

    if (topic.id === activeDiscussionTopic) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeDiscussionTopic = topic.id;
      renderTopics();
      renderComments();
    });

    discussionTabsContainer.appendChild(button);
  });
}

function getComments() {
  return JSON.parse(localStorage.getItem("greenYComments")) || [];
}

function saveComments(comments) {
  localStorage.setItem("greenYComments", JSON.stringify(comments));
}

function renderComments() {
  const comments = getComments().filter(comment => comment.topic === activeDiscussionTopic);

  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = `<p>No comments yet. Be the first to write something.</p>`;
    return;
  }

  comments.forEach(comment => {
    const card = document.createElement("div");
    card.classList.add("comment-card");

    card.innerHTML = `
      <h3>${comment.username}</h3>
      <p>${comment.text}</p>
      <small>${comment.date}</small>
    `;

    commentsList.appendChild(card);
  });
}

addTopicBtn.addEventListener("click", () => {
  const topicName = newTopicInput.value.trim();

  if (!topicName) {
    alert("Write topic name.");
    return;
  }

  const topics = getTopics();
  const topicId = createTopicId(topicName);

  const exists = topics.some(topic => topic.id === topicId);

  if (exists) {
    alert("This topic already exists.");
    return;
  }

  topics.push({
    id: topicId,
    name: topicName
  });

  saveTopics(topics);

  activeDiscussionTopic = topicId;
  newTopicInput.value = "";

  renderTopics();
  renderComments();
});

sendComment.addEventListener("click", () => {
  const username = commentUser.value.trim();
  const text = commentText.value.trim();

  if (!username || !text) {
    alert("Enter username and comment.");
    return;
  }

  const comments = getComments();

  comments.push({
    topic: activeDiscussionTopic,
    username: username,
    text: text,
    date: new Date().toLocaleString()
  });

  saveComments(comments);

  commentText.value = "";
  renderComments();
});

renderTopics();
renderComments();
const languageSelect = document.getElementById("languageSelect");
const bellBtn = document.getElementById("bellBtn");
const notificationCount = document.getElementById("notificationCount");
const notificationsList = document.getElementById("notificationsList");
const sendAdminMessage = document.getElementById("sendAdminMessage");
const adminMessageInput = document.getElementById("adminMessageInput");

const profileBtn = document.getElementById("profileBtn");
const profileUsername = document.getElementById("profileUsername");
const profileRating = document.getElementById("profileRating");

const burgerBtn = document.getElementById("burgerBtn");
const burgerMenu = document.getElementById("burgerMenu");
const menuSearch = document.getElementById("menuSearch");
const menuHome = document.getElementById("menuHome");
const menuLogout = document.getElementById("menuLogout");

const translations = {
  en: {
    home: "Home",
    progress: "Progress",
    tech: "Tech Moments",
    classes: "Classes and Tests",
    tests: "Rating",
    settings: "Settings",

    unfinishedCourses: "Your unfinished courses",
    allInfo: "All Informations",

    domainTitle: "CLOUD BASICS",
    domainText: "Изучайте современные облачные системы, виртуальные серверы и корпоративные платформы.",

    mikrotikTitle: "MikroTik Basics",
    mikrotikText: "Router setup, IP, DHCP, firewall and network rules",

    domainCardTitle: "CLOUD BASICS",
    domainCardText: "Cloud systems, virtual servers and enterprise platforms.",

    mikrotikCardTitle: "MikroTik",
    mikrotikCardText: "Router setup, DHCP, IP, firewall and security.",

    serverCardTitle: "Windows Server",
    serverCardText: "Server roles, DNS, DHCP, GPO and management.",

    securityCardTitle: "Security",
    securityCardText: "Network security basics and user protection.",

    techMoments: "Tech Moments",
    techSubtitle: "Discuss technical topics, ask questions and leave comments."
  },

  ru: {
    home: "Главная",
    progress: "Прогресс",
    tech: "Тех. моменты",
    classes: "Классы",
    tests: "Тесты",
    settings: "Настройки",

    unfinishedCourses: "Ваши незавершённые курсы",
    allInfo: "Вся информация",

    domainTitle: "CLOUD BASICS",
    domainText: "Изучайте современные облачные системы, виртуальные серверы и корпоративные платформы.",

    mikrotikTitle: "Основы MikroTik",
    mikrotikText: "Настройка роутера, IP, DHCP, firewall и сетевые правила",

    domainCardTitle: "CLOUD BASICS",
    domainCardText: "Облачные системы, виртуальные серверы и корпоративные платформы.",

    mikrotikCardTitle: "MikroTik",
    mikrotikCardText: "Настройка роутера, DHCP, IP, firewall и безопасность.",

    serverCardTitle: "Windows Server",
    serverCardText: "Роли сервера, DNS, DHCP, GPO и управление.",

    securityCardTitle: "Security",
    securityCardText: "Основы безопасности сети и защиты пользователей.",

    techMoments: "Тех. моменты",
    techSubtitle: "Обсуждайте технические темы, задавайте вопросы и оставляйте комментарии."
  },

  uk: {
    home: "Головна",
    progress: "Прогрес",
    tech: "Тех. моменти",
    classes: "Класи",
    tests: "Тести",
    settings: "Налаштування",

    unfinishedCourses: "Ваші незавершені курси",
    allInfo: "Уся інформація",

    domainTitle: "CLOUD BASICS",
    domainText: "Вивчайте сучасні хмарні системи, віртуальні сервери та корпоративні платформи.",

    mikrotikTitle: "Основи MikroTik",
    mikrotikText: "Налаштування роутера, IP, DHCP, firewall і мережеві правила",

    domainCardTitle: "CLOUD BASICS",
    domainCardText: "Хмарні системи, віртуальні сервери та корпоративні платформи.",

    mikrotikCardTitle: "MikroTik",
    mikrotikCardText: "Налаштування роутера, DHCP, IP, firewall і безпека.",

    serverCardTitle: "Windows Server",
    serverCardText: "Ролі сервера, DNS, DHCP, GPO і керування.",

    securityCardTitle: "Security",
    securityCardText: "Основи безпеки мережі та захисту користувачів.",

    techMoments: "Тех. моменти",
    techSubtitle: "Обговорюйте технічні теми, ставте питання та залишайте коментарі."
  },

  es: {
    home: "Inicio",
    progress: "Progreso",
    tech: "Momentos técnicos",
    classes: "Clases",
    tests: "Pruebas",
    settings: "Configuración",

    unfinishedCourses: "Tus cursos sin terminar",
    allInfo: "Toda la información",

    domainTitle: "CLOUD BASICS",
    domainText: "Aprende sistemas cloud modernos, servidores virtuales y plataformas empresariales.",

    mikrotikTitle: "Conceptos básicos de MikroTik",
    mikrotikText: "Configuración del router, IP, DHCP, firewall y reglas de red",

    domainCardTitle: "CLOUD BASICS",
    domainCardText: "Sistemas cloud, servidores virtuales y plataformas empresariales.",

    mikrotikCardTitle: "MikroTik",
    mikrotikCardText: "Configuración del router, DHCP, IP, firewall y seguridad.",

    serverCardTitle: "Windows Server",
    serverCardText: "Roles del servidor, DNS, DHCP, GPO y administración.",

    securityCardTitle: "Seguridad",
    securityCardText: "Fundamentos de seguridad de red y protección de usuarios.",

    techMoments: "Momentos técnicos",
    techSubtitle: "Discute temas técnicos, haz preguntas y deja comentarios."
  }
};

function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function getAdminMessages() {
  return JSON.parse(localStorage.getItem("greenYAdminMessages")) || [];
}

function saveAdminMessages(messages) {
  localStorage.setItem("greenYAdminMessages", JSON.stringify(messages));
}

function renderNotifications() {
  const messages = getAdminMessages();

  notificationsList.innerHTML = "";

  if (messages.length === 0) {
    notificationsList.innerHTML = "<p>No notifications yet.</p>";
    return;
  }

  messages.forEach(message => {
    const card = document.createElement("div");
    card.className = "notification-card";

    card.innerHTML = `
      <h3>Admin</h3>
      <p>${message.text}</p>
      <small>${message.date}</small>
    `;

    notificationsList.appendChild(card);
  });
}

function updateNotificationCount() {
  const messages = getAdminMessages();
  const unread = Number(localStorage.getItem("greenYUnreadMessages")) || 0;

  if (unread > 0) {
    notificationCount.style.display = "inline-block";
    notificationCount.textContent = unread;
  } else {
    notificationCount.style.display = "none";
  }
}

sendAdminMessage.addEventListener("click", () => {
  const text = adminMessageInput.value.trim();

  if (!text) {
    alert("Write message.");
    return;
  }

  const messages = getAdminMessages();

  messages.unshift({
    text,
    date: new Date().toLocaleString()
  });

  saveAdminMessages(messages);

  const unread = Number(localStorage.getItem("greenYUnreadMessages")) || 0;
  localStorage.setItem("greenYUnreadMessages", unread + 1);

  adminMessageInput.value = "";
  renderNotifications();
  updateNotificationCount();
}); 

bellBtn.addEventListener("click", () => {
  showPage("notifications");
  localStorage.setItem("greenYUnreadMessages", 0);
  updateNotificationCount();
  renderNotifications();
});

profileBtn.addEventListener("click", async () => {
  const users = await getUsers();
  const savedUsername = localStorage.getItem("greenYCurrentUser");
  const currentUser = users.find(user => user.username === savedUsername);

  if (!currentUser) {
    profileUsername.textContent = savedUsername || "Guest";
    profileRating.textContent = "---";
  } else {
    profileUsername.textContent = currentUser.username;
    profileRating.textContent = getUserRating(currentUser.username) + "%";
  }

  showPage("profile");
});

burgerBtn.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
});

menuSearch.addEventListener("click", () => {
  document.querySelector(".search input").focus();
  burgerMenu.classList.remove("active");
});

menuHome.addEventListener("click", () => {
  showPage("home");
  burgerMenu.classList.remove("active");
});

menuLogout.addEventListener("click", () => {
  alert("You logged out.");
  burgerMenu.classList.remove("active");
});

languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;
  const t = translations[lang];

  document.querySelector('[data-page="home"]').innerHTML = `⌂ ${t.home}`;
  document.querySelector('[data-page="progress"]').innerHTML = `▥ ${t.progress}`;
  document.querySelector('[data-page="messages"]').innerHTML = `💬 ${t.tech}`;
  document.querySelector('[data-page="classes"]').innerHTML = `▣ ${t.classes}`;
  document.querySelector('[data-page="tests"]').innerHTML = `✓ ${t.tests}`;
  document.querySelector('[data-page="settings"]').innerHTML = `<img class="menu-icon" src="settings.jpg" alt=""> <span>${t.settings}</span>`;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) {
  element.textContent = t[key];
}
  });

  localStorage.setItem("greenYLanguage", lang);
});

const savedLang = localStorage.getItem("greenYLanguage") || "en";
languageSelect.value = savedLang;
languageSelect.dispatchEvent(new Event("change"));

renderNotifications();
updateNotificationCount();
const openFirstTest = document.getElementById("openFirstTest");
const backToClasses = document.getElementById("backToClasses");
const firstTestForm = document.getElementById("firstTestForm");
const testUsername = document.getElementById("testUsername");
const testResult = document.getElementById("testResult");
const autoQuestions = document.getElementById("autoQuestions");
const logicQuestionsBox = document.getElementById("logicQuestions");

const testQuestions = [
  {
    id: "q1",
    number: 1,
    question: "Что чаще всего является признаком возникновения loop в локальной сети?",
    options: {
      A: "Периодические обрывы VPN-соединений и рост задержек",
      B: "Нестабильная работа DHCP и резкий рост broadcast-трафика",
      C: "Потеря связи с отдельными Wi-Fi точками доступа",
      D: "Кратковременные проблемы с DNS-резолвингом"
    },
    correct: "B"
  },
  {
    id: "q2",
    number: 2,
    question: "Что наиболее вероятно указывает на проблему с DNS?",
    options: {
      A: "Ping по IP проходит, но сайты по доменному имени не открываются",
      B: "VPN подключается медленнее обычного",
      C: "DHCP выдает адреса с задержкой",
      D: "Периодически пропадает Wi-Fi"
    },
    correct: "A"
  },
  {
    id: "q3",
    number: 3,
    question: "Что чаще всего вызывает плохое качество VoIP-звонков?",
    options: {
      A: "Неверный DNS suffix",
      B: "Высокий jitter и потери UDP-пакетов",
      C: "Неправильная MTU на Wi-Fi",
      D: "Ошибка маршрутизации DHCP"
    },
    correct: "B"
  },
  {
    id: "q4",
    number: 4,
    question: "Что наиболее вероятно произойдет при конфликте IP-адресов?",
    options: {
      A: "Частичная потеря доступа к локальным ресурсам",
      B: "Рост broadcast-трафика во всей сети",
      C: "Ошибка авторизации доменных пользователей",
      D: "Автоматическое отключение DHCP-сервера"
    },
    correct: "A"
  },
  {
    id: "q5",
    number: 5,
    question: "Почему в офисе может периодически пропадать Wi-Fi при нормальной работе кабельной сети?",
    options: {
      A: "Неверный gateway у DHCP-сервера",
      B: "Конфликт каналов между точками доступа",
      C: "Ошибка NAT masquerade",
      D: "Неправильный VLAN ID на DNS-сервере"
    },
    correct: "B"
  },
  {
    id: "q6",
    number: 6,
    question: "Что чаще всего является причиной нестабильного VPN-соединения?",
    options: {
      A: "Высокий jitter и packet loss",
      B: "Слишком большой DHCP pool",
      C: "Конфликт NetBIOS имен",
      D: "Неправильная работа STP"
    },
    correct: "A"
  },
  {
    id: "q7",
    number: 7,
    question: "Для чего чаще всего используется VLAN?",
    options: {
      A: "Разделение широковещательных доменов",
      B: "Ускорение DNS-запросов",
      C: "Повышение мощности Wi-Fi",
      D: "Шифрование локальной сети"
    },
    correct: "A"
  },
  {
    id: "q8",
    number: 8,
    question: "Что чаще всего приводит к высокой загрузке коммутатора?",
    options: {
      A: "Большое количество DHCP lease",
      B: "Broadcast storm",
      C: "Слабый Wi-Fi сигнал",
      D: "Переполненный DNS cache"
    },
    correct: "B"
  },
  {
    id: "q9",
    number: 9,
    question: "Какой симптом чаще всего указывает на loop?",
    options: {
      A: "Высокая загрузка CPU на коммутаторах",
      B: "Ошибка времени Windows",
      C: "Медленная работа браузера только на одном ПК",
      D: "Потеря пароля пользователя"
    },
    correct: "A"
  },
  {
    id: "q10",
    number: 10,
    question: "Что наиболее важно для стабильной работы корпоративного Wi-Fi?",
    options: {
      A: "Одинаковый SSID и корректное распределение каналов",
      B: "Максимальная мощность всех точек доступа",
      C: "Разные DNS-сервера на каждой точке",
      D: "Отключенный DHCP"
    },
    correct: "A"
  },
  {
    id: "q11",
    number: 11,
    question: "Что делает NAT masquerade в MikroTik?",
    options: {
      A: "Подменяет внутренние IP при выходе в интернет",
      B: "Создает VLAN между интерфейсами",
      C: "Фильтрует DNS-запросы",
      D: "Управляет STP"
    },
    correct: "A"
  },
  {
    id: "q12",
    number: 12,
    question: "Для чего чаще используют bridge в MikroTik?",
    options: {
      A: "Объединение интерфейсов в один L2-сегмент",
      B: "Балансировка интернет-каналов",
      C: "Создание VPN-туннеля",
      D: "Ограничение скорости пользователей"
    },
    correct: "A"
  },
  {
    id: "q13",
    number: 13,
    question: "Какой инструмент MikroTik чаще используют для анализа трафика?",
    options: {
      A: "Netinstall",
      B: "Torch",
      C: "Dude",
      D: "Neighbor Discovery"
    },
    correct: "B"
  },
  {
    id: "q14",
    number: 14,
    question: "Что чаще всего вызывает высокий ping внутри локальной сети?",
    options: {
      A: "Перегруженный канал или loop",
      B: "Неверный DNS",
      C: "Маленький DHCP pool",
      D: "Неправильное имя ПК"
    },
    correct: "A"
  },
  {
    id: "q15",
    number: 15,
    question: "Какой тип VPN считается более современным и быстрым?",
    options: {
      A: "PPTP",
      B: "L2TP",
      C: "WireGuard",
      D: "SSTP"
    },
    correct: "C"
  },
  {
    id: "q16",
    number: 16,
    question: "Почему PPTP считается небезопасным?",
    options: {
      A: "Использует устаревшие механизмы шифрования",
      B: "Не поддерживает DHCP",
      C: "Не работает через NAT",
      D: "Не поддерживает VLAN"
    },
    correct: "A"
  },
  {
    id: "q17",
    number: 17,
    question: "Что чаще всего приводит к проблемам с roaming между точками доступа?",
    options: {
      A: "Разные SSID и настройки безопасности",
      B: "Большой DHCP pool",
      C: "Высокая скорость интернет-канала",
      D: "Использование VLAN"
    },
    correct: "A"
  },
  {
    id: "q18",
    number: 18,
    question: "Что делает DHCP?",
    options: {
      A: "Автоматически выдает сетевые настройки клиентам",
      B: "Шифрует трафик между VLAN",
      C: "Управляет DNS cache",
      D: "Балансирует нагрузку каналов"
    },
    correct: "A"
  },
  {
    id: "q19",
    number: 19,
    question: "Что наиболее вероятно произойдет при неверном subnet mask?",
    options: {
      A: "Устройство не сможет корректно определять локальную сеть",
      B: "DHCP перестанет работать на всех устройствах",
      C: "Пропадет DNS",
      D: "Отключится Wi-Fi адаптер"
    },
    correct: "A"
  },
  {
    id: "q20",
    number: 20,
    question: "Что чаще всего проверяют первым при отсутствии интернета на ПК?",
    options: {
      A: "IP-адрес, gateway и доступность шлюза",
      B: "Обновления Windows",
      C: "Версию BIOS",
      D: "Температуру процессора"
    },
    correct: "A"
  },
  {
    id: "q21",
    number: 21,
    question: "Для чего используется STP?",
    options: {
      A: "Предотвращение сетевых петель",
      B: "Шифрование Wi-Fi",
      C: "Балансировка VPN",
      D: "Работа DHCP relay"
    },
    correct: "A"
  },
  {
    id: "q22",
    number: 22,
    question: "Что чаще всего вызывает packet loss в Wi-Fi сети?",
    options: {
      A: "Интерференция и слабый сигнал",
      B: "Большой DHCP lease time",
      C: "Отключенный DNS",
      D: "Ошибка Active Directory"
    },
    correct: "A"
  },
  {
    id: "q23",
    number: 23,
    question: "Какой порт по умолчанию использует RDP?",
    options: {
      A: "22",
      B: "3389",
      C: "5060",
      D: "443"
    },
    correct: "B"
  },
  {
    id: "q24",
    number: 24,
    question: "Почему пользователям не рекомендуется выдавать локальные права администратора?",
    options: {
      A: "Повышается риск установки вредоносного ПО и изменения системных настроек",
      B: "Ухудшается работа DNS",
      C: "Снижается скорость Wi-Fi",
      D: "Перестает работать DHCP"
    },
    correct: "A"
  },
  {
    id: "q25",
    number: 25,
    question: "Что чаще всего является причиной перегрузки Wi-Fi в офисе?",
    options: {
      A: "Слишком много клиентов на одном канале",
      B: "Наличие VLAN",
      C: "Использование статических IP",
      D: "Наличие NAT"
    },
    correct: "A"
  },
  {
    id: "q26",
    number: 26,
    question: "Что наиболее вероятно вызовет проблемы с телефонией?",
    options: {
      A: "Высокий jitter и задержки",
      B: "Неверный hostname ПК",
      C: "Большой DHCP pool",
      D: "Разные версии Windows"
    },
    correct: "A"
  },
  {
    id: "q27",
    number: 27,
    question: "Что чаще всего указывает на проблему с DHCP?",
    options: {
      A: "Клиент получает APIPA-адрес 169.254.x.x",
      B: "Высокий ping до DNS",
      C: "Ошибка авторизации VPN",
      D: "Медленная загрузка браузера"
    },
    correct: "A"
  },
  {
    id: "q28",
    number: 28,
    question: "Что чаще всего используют для сегментации сети офиса?",
    options: {
      A: "VLAN",
      B: "NAT",
      C: "DNS",
      D: "Proxy"
    },
    correct: "A"
  },
  {
    id: "q29",
    number: 29,
    question: "Почему важно разделять телефонию и рабочие ПК по VLAN?",
    options: {
      A: "Для уменьшения влияния пользовательского трафика на VoIP",
      B: "Для ускорения DNS",
      C: "Для уменьшения DHCP lease",
      D: "Для работы Wi-Fi roaming"
    },
    correct: "A"
  },
  {
    id: "q30",
    number: 30,
    question: "Что чаще всего проверяют при жалобе на медленный интернет?",
    options: {
      A: "Потери пакетов, загрузку канала и задержки",
      B: "Название ПК пользователя",
      C: "Версию Windows",
      D: "Цвет кабеля Ethernet"
    },
    correct: "A"
  }
];

const logicQuestions = [
  "В офисе периодически пропадает интернет у всех устройств. С чего начнешь диагностику?",
  "Пользователь говорит, что интернет “лагает”, но только у него. Какие проверки сделаешь первыми?",
  "Как определить, проблема в сети или в конкретном ПК?",
  "В сети резко вырос ping и загрузка коммутаторов. Какие причины наиболее вероятны?",
  "В офисе плохо работает VoIP только вечером. Почему это может происходить?",
  "Почему loop считается одной из самых опасных проблем в локальной сети?",
  "Как понять, что проблема именно в DNS, а не в интернете?",
  "Почему не рекомендуется ставить максимальную мощность на все Wi-Fi точки?",
  "Что лучше для офиса: один мощный роутер или несколько точек доступа? И почему?",
  "Почему разделение сети по VLAN повышает безопасность и стабильность офиса?"
];

function renderTestQuestions() {
  autoQuestions.innerHTML = "";

  testQuestions.forEach(q => {
    autoQuestions.innerHTML += `
      <div class="question">
        <h3>${q.number}. ${q.question}</h3>

        <label><input type="radio" name="${q.id}" value="A"> A) ${q.options.A}</label>
        <label><input type="radio" name="${q.id}" value="B"> B) ${q.options.B}</label>
        <label><input type="radio" name="${q.id}" value="C"> C) ${q.options.C}</label>
        <label><input type="radio" name="${q.id}" value="D"> D) ${q.options.D}</label>
      </div>
    `;
  });
}

function renderLogicQuestions() {
  logicQuestionsBox.innerHTML = "";

  logicQuestions.forEach((question, index) => {
    logicQuestionsBox.innerHTML += `
      <div class="question">
        <h3>Логическое задание ${index + 1}</h3>
        <p>${question}</p>
        <textarea class="logic-answer" name="logic${index + 1}" placeholder="Write your answer here..."></textarea>
      </div>
    `;
  });
}

function getTestResults() {
  return JSON.parse(localStorage.getItem("greenYTestResults")) || [];
}

function saveTestResults(results) {
  localStorage.setItem("greenYTestResults", JSON.stringify(results));
}

async function userIsRegistered(username) {
  const users = await getUsers();
  return users.some(user => user.username === username);
}

function userAlreadyPassed(username) {
  const results = getTestResults();
  return results.some(result => result.username === username && result.testId === "first-test");
}

openFirstTest.addEventListener("click", () => {
  showPage("firstTest");

  firstTestForm.style.display = "block";
  testResult.innerHTML = "";

  renderTestQuestions();
  renderLogicQuestions();
});

backToClasses.addEventListener("click", () => {
  showPage("classes");
});

firstTestForm.addEventListener("submit", async (event) => {
  event.preventDefault();

let username = testUsername.value.trim();

const savedUser = localStorage.getItem("greenYCurrentUser");

if (!username && savedUser) {
  username = savedUser;
}

if (!username) {
  alert("You must log in before passing the test.");
  return;
}

  if (!(await userIsRegistered(username))) {
    alert("This user is not registered.");
    return;
  }

  if (userAlreadyPassed(username)) {
    alert("This user has already passed this test.");
    return;
  }

  let correct = 0;
  let wrong = 0;

  const userAnswers = {};
  const logicAnswers = {};

  testQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);

    if (!selected) {
      userAnswers[q.id] = null;
      wrong++;
      return;
    }

    userAnswers[q.id] = selected.value;

    if (selected.value === q.correct) {
      correct++;
    } else {
      wrong++;
    }
  });

  logicQuestions.forEach((question, index) => {
    const textarea = document.querySelector(`textarea[name="logic${index + 1}"]`);

    logicAnswers[`logic${index + 1}`] = {
      question: question,
      answer: textarea.value.trim()
    };
  });

  const total = testQuestions.length;
  const percent = Math.round((correct / total) * 100);

  const results = getTestResults();

  results.push({
    testId: "first-test",
    testName: "Первый тест",
    username: username,
    correct: correct,
    wrong: wrong,
    percent: percent,
    userAnswers: userAnswers,
    logicAnswers: logicAnswers,
    date: new Date().toLocaleString()
  });

  saveTestResults(results);
  renderUsers();
  testResult.innerHTML = `
    <h2>Test finished</h2>
    <p><b>User:</b> ${username}</p>
    <p><b>Correct answers:</b> ${correct}</p>
    <p><b>Wrong answers:</b> ${wrong}</p>
    <p><b>Accuracy:</b> ${percent}%</p>
    <p>Logical answers were saved for admin review.</p>
  `;

  firstTestForm.style.display = "none";

  if (typeof renderUsers === "function") {
    renderUsers();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("authModal").style.display = "flex";

  document.getElementById("showLogin").addEventListener("click", showLoginForm);
  document.getElementById("showRegister").addEventListener("click", showRegisterForm);
});

function showLoginForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";

  document.getElementById("showLogin").classList.add("active");
  document.getElementById("showRegister").classList.remove("active");
}

function showRegisterForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";

  document.getElementById("showRegister").classList.add("active");
  document.getElementById("showLogin").classList.remove("active");
}
async function registerUser() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value.trim();
  const message = document.getElementById("authMessage");

  if (!username || !email || !password) {
    message.textContent = "Введите имя, email и пароль";
    return;
  }

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  const userId = data.user?.id;

  if (!userId) {
    message.textContent = "Проверьте email для подтверждения аккаунта";
    return;
  }

  const { error: insertError } = await db
    .from("green_y_users")
    .insert([
      {
        id: userId,
        username,
        region: "SD",
        rating: 0
      }
    ]);

  if (insertError) {
    message.textContent = insertError.message;
    return;
  }

  localStorage.setItem("greenYCurrentUser", username);
  document.getElementById("authModal").style.display = "none";

  await renderUsers();

  alert("Аккаунт создан!");
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("authMessage");

  if (!email || !password) {
    message.textContent = "Введите email и пароль";
    return;
  }

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = "Неверный email или пароль";
    return;
  }

  let { data: profile, error: profileError } = await db
    .from("green_y_users")
    .select("username")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    message.textContent = profileError.message;
    return;
  }

  if (!profile) {
    const username =
      data.user.user_metadata?.username ||
      email.split("@")[0];

    const { data: createdProfile, error: createProfileError } = await db
      .from("green_y_users")
      .insert([
        {
          id: data.user.id,
          username,
          region: "SD",
          rating: 0
        }
      ])
      .select("username")
      .single();

    if (createProfileError) {
      message.textContent = createProfileError.message;
      return;
    }

    profile = createdProfile;
  }

  localStorage.setItem("greenYCurrentUser", profile.username);
  document.getElementById("authModal").style.display = "none";

  await renderUsers();

  alert("Добро пожаловать, " + profile.username);
}
function togglePassword(id) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}



