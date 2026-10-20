# 建筑事务所作品集单页

**平台运行约定（不要破坏）**：本模版在平台登记为**静态站**。预览固定执行
`npm run dev -- --host 0.0.0.0 --port <平台端口>`，发布固定执行
`npm run build` 并把 `dist/`（必须包含 `index.html`）整体上架。
`dev`/`build` 两个 script 必须保留；平台不读 Dockerfile，不需要新建。
`server.js` 是可选后端（本地 `node server.js` 提供联系表单存储），不参与
平台发布流程。

## 界面语言

**这是中文版**，界面固定为中文（`LangContext.jsx` 的 `detect()` 已写死返回
`zh`，站头不含语言切换按钮）。英文版是另一个独立模版。

数据层仍保留 `{ zh, en }` 双语结构，改文案时只动 `zh` 字段即可；`t()` 遇到双语
对象取当前语言、遇到普通值原样返回。若要恢复双语切换：把 `detect()` 改回按
`navigator.language` 判断，并在站头补回 `.langswitch` 按钮（参照英文版实现）。

## 部署信息

- 模版 slug：`architect-portfolio-cn`
- 预览地址：https://e67x4giukdfpg.kimi.site
- 部署形态：fullstack（`kimi.site`）。remix 时把 `public/config.json` 的
  `backend` 改成 `true` 再发布（`false` 时表单走 `mailto:`，打开后真实落库 TiDB）。

## 动手前先问

用 ask_user 问下面几个问题，再决定改什么：

1. **remix 时默认打开后端并以全栈交付。** 仓库根有 `server.js`（Node 内置 http
   托管 `dist/` + `POST /api/enquiries` 写入 TiDB）与 `bootstrap`（全栈站启动
   脚本），前端读 `public/config.json` 的 `backend` 开关。remix 时把它改成
   `true`，以 fullstack 形态发布（平台注入 `DATABASE_URL`，启动时自动
   `CREATE TABLE IF NOT EXISTS enquiries`），并验证表单真实落库（提交返回
   `{"ok":true}`、刷新后仍在）。仅当用户明确只要纯静态演示站时才保持
   `false`——那时表单走 `mailto:`，不发起任何 api 请求。
2. **事务所信息是什么？** 名称、成立年份、常驻城市、邮箱、地址、电话，以及一句
   执业定位（写清楚做哪几类房子）。
3. **有几个项目要放进来？** 每个项目需要：年份、名称、类型、城市、建筑面积、业主、
   结构形式、合作方、摄影、建成状态，以及 200–320 字的项目陈述。
4. **配色沿用现在的无彩底 + 一枚蓝，还是换强调色？** 底色与墨色一般不建议动，
   换强调色只改 `--accent` 一个变量即可。
5. **图片从哪里来？** 用户自己的项目照片与图纸，还是继续用生成图。

如果用户什么都不回答，直接加载默认内容即可，页面本身是完整可用的。

## 这个网站是什么

一间小型建筑事务所的作品集网站：一张首页 + 每个作品的独立档案页（哈希路由
`#/project/<id>`，无需服务端配置）。首页信息结构自上而下是：站头（吸顶导航 +
滚动高亮 + 语言切换）→ 首屏（事务所名称、定位、三个统计数字全部在一屏内直接可见，
照片作为背景在文字之后揭开）→ 六个章节，每章的导引块只有章节名；需要右栏说明时
在 `studio.js` 的该章节上加 `guide` 字段，`SectionLead` 会自动排出（目前只有
精选一章写了）：

- **精选作品** —— 首屏往下第一眼看到的就是三个近作的大照片，**不需要任何点击**。
  这一段是**钉住视口的换片舞台**：滚动时画面不动，图文在原地一张张切换，
  右下角有进度条与可点击的页码。每张一幅主图 + 一张压在下角的细部照片，
  文字块以纸面覆盖在照片一角，左右交错。照片占九栏、文字占五栏，让照片主导。
  窄屏与减弱动效下自动退回普通的纵向堆叠。
- **作品索引** —— 同样是一座钉住视口的舞台，只是换的不是照片而是**名单页**：
  十二个项目每六个一页，一页的行平分页高，正好上下占满一屏；滚动时名单原地换页，
  右侧的竖幅大图与左侧表格严格等高、上下对齐，图注压在底部一行。
  表格本身收窄（年份 / 项目 / 类型 / 面积，地点收进档案里），把横向空间让给照片；
  点击列头切换排序并播 FLIP 位移动画；桌面上鼠标划过某行时右侧换看该项目的构造细节，
  未悬停时默认显示当前页的第一个项目。点击任意一行进入该项目的独立档案页。
- **图纸与过程** —— 一条可拖拽 / 横滑的图纸带，下方是连续映射的进度条。
- **历程** —— 执业与合作、获奖、展览三栏并列，年份等宽左对齐。
- **手记** —— 手风琴式短文，同一时刻只展开一条。
- **联系** —— 反白区块，左边是邮箱 / 地址 / 电话，右边是合作意向表单。

**每个作品都有独立档案页**：索引里的每一行都是链接，点击进 `#/project/<id>`。
溪岸住宅、三山巷改造、白塔美术馆扩建三个项目有精心设计的深度页，排版刻意不同，
由 `src/data/stories.js` 里的 `layout` 字段决定：

- `ladder`（溪岸住宅）—— 图文左右交错下行，宽 / 窄 / 满幅三种图幅交替，呼应场地层层下落。
- `column`（三山巷改造）—— 窄栏长文居中，竖幅图夹在文字之间，读起来像一条深长的巷子。
- `plate`（白塔美术馆扩建）—— 满幅出血图版 + 左侧窄栏侧注，像一本展览图录。

其余九个项目走通用档案页版式（`ProjectPage.jsx` 里无 story 时的分支）：标题与
一句话介绍、项目陈述、四项要点（类型 / 地点 / 面积 / 状态）、满幅主图、图纸带、
完整项目信息表，页脚串到下一个项目。想给某个项目升级成深度页：在 `stories.js`
里加一条（`layout` 选上面三种之一或自己写一套），把 id 加进 `featuredIds` 即可。

```
index.html                  入口，必须留在仓库根目录
vite.config.js
package.json
serve.sh                    本地预览
server.js                   全栈服务端（托管 dist + /api/enquiries，默认不启用）
bootstrap                   全栈站启动脚本（sitepub --kind fullstack）
public/assets/images/       全部位图（webp）
public/config.json          功能开关（backend: 是否启用后端存储）
src/
  main.jsx  App.jsx
  i18n/LangContext.jsx      语言状态 + t() 取值函数
  i18n/ui.js                界面固定文案的双语表（部分值是函数）
  data/studio.js            事务所信息 + 六个章节的标题与可选导引
  data/projects.js          12 个项目 + 类型 / 状态字典（含 oneLine 一句话介绍）
  data/credits.js           历程三组
  data/notes.js             手记
  data/stories.js           三个档案页的正文与排版骨架 + featuredIds / featuredShots
  sections/                 SiteHead Cover FeaturedWorks WorkIndex ProjectPage
                            DrawingStrip Credits Notes Contact SiteFooter
  parts/                    InfoTable HoverPreview SectionLead Toast
  hooks/                    useReveal useSwapStage useFeaturedStage useScrollScene
                            useFlipSort useDragScroll useRoute
  styles/                   fonts.css tokens.css base.css sections.css
  assets/fonts/             自托管 Inter / Inter Tight woff2（无外部字体请求）
```

**可以被改成什么**：这套「巨大标题 + 可排序索引 + 独立档案页」的结构不限于建筑。
换掉 `src/data/` 就能变成摄影师 / 工业设计工作室 / 家具品牌的作品集，或者律所、
咨询公司的案例库、研究团队的论文索引、装修公司的工程档案。列的含义写在
`WorkIndex.jsx` 的 `COLUMNS` 里，改列名与排序键即可（数值列走 `a-b`，文本列走
`Intl.Collator`）。

**注意**：换素材不等于改网站。用户上传新的项目照片时，必须按新图重写
`src/data/projects.js` 里的项目名、面积、结构、陈述等全部字段，并同步 `alt` 文案；
只替换 `public/assets/images/` 里的文件不算完成。图片数量变化时，还要检查
`gallery` 少于 3 张的项目——图纸带会自动隐藏而不是留空框。

## 技术要点

**没有引任何 UI / 动画 / 滚动库**，依赖只有 react / react-dom / vite。想加效果时
优先照下面这几套现成的做法扩展，不要引入新依赖。

- **时长的单一事实来源**：所有动效时长写在 `tokens.css` 的 `--file-open` /
  `--file-close` / `--flip` 里，JS 用 `getComputedStyle(document.documentElement)
  .getPropertyValue(name)` 读回再乘 1000。改时长只改 CSS 一处。
- **FLIP 重排**（`useFlipSort.js`）：先对每行 `getAnimations().forEach(a => a.finish())`
  让上一轮立刻落位，再量 `getBoundingClientRect().top`，`mutate()` 之后从
  `translateY(delta)` 动回 0。这样连点列头不会产生动画堆叠。
- **高度过渡用 WAAPI**（`Notes.jsx` 的手风琴）：从当前实测高度动到
  `scrollHeight`，`finished` 回调里把 height 复位成 `auto`；新点击先 `cancel()`
  上一次，所以反向收拢不会跳。
- **一次性揭示**（`useReveal.js`）：`IntersectionObserver` 命中后立即 `unobserve`，
  反复上下滚不重播；`prefers-reduced-motion` 下直接落到终态。
- **拖拽横滑**（`useDragScroll.js`）：`overflow-x:auto` + `scroll-snap` 原生滚动，
  桌面用 pointer 事件改 `scrollLeft`，位移超过 6px 才判定为拖拽（否则算点击）；
  `touch-action: pan-y` 保证不抢页面纵向滚动；进度条用 `transform: scaleX()` 更新，
  不改 width。
- **首屏的入场次序**（`Cover.jsx`）：文字先于图片。事务所名中文逐字、**英文逐词**
  切分（`splitName()`，英文按词切避免拆成孤立字母），每一份包在
  `.glyphbox`（`overflow:hidden`）里从 `translateY(105%)` 升起，`--glyph-index` 算
  `transition-delay` 且有封顶；随后定位、简介、三个数字依次淡入；照片最后
  才从 `opacity 0 / scale(1.06)` 揭开。底图是一栋森林山地间的住宅，能同时读到建筑与
  环境；左侧文字区压着一层近白渐变面纱（`.coverveil`，左端 .95 递减到右端 .04），
  照片右侧几乎全透，而标题区的对比度不论换成什么照片都不会失守。换底图后请在
  1440 / 1024 / 375 三档下各量一次文字区的对比度再定稿。
- **哈希路由**（`useRoute.js`）：`#/project/<id>` 进档案页，`#/<anchor>` 回首页并
  滚到对应章节，纯静态托管即可，不需要服务端 rewrite。
- **滚动高亮**（`App.jsx`）：一个 `IntersectionObserver` 观察六个 section，
  `rootMargin: '-45% 0px -45% 0px'` 取视口中带，命中的 id 写进站头导航的 `.current`。
- **精选区是一个滚动驱动的换片舞台**（`useFeaturedStage.js` + `.featuredstage`）。
  这里的目标是：滚动时应当感觉到**图文在原地自动切换**，而不是页面在向下滑动。
  做法分三层：
  1. *钉住视口* —— `.featuredstage` 只负责给出 `300svh` 的滚动行程，真正显示内容的
     `.featuredviewport` 是 `position: sticky`。于是滚轮转动时视口纹丝不动
     （实测全程 `top` 恒为 88px），被消费掉的行程转换成「第几张」。
     舞台高度是 `380svh`（三张各一屏，末尾多留一段停留），加减作品时按张数同比调整。
  2. *原地换片* —— 三张 `.featuredslide` 全部 `position: absolute` 重叠在同一块画面里，
     彼此不做横向位移。新的一张用 `clip-path: inset(var(--clip) 0 0 0)` 自下而上把自己
     揭开（100%→0%），压角的细部照片方向相反（`inset(0 0 var(--clip) 0)`），
     所以主图与细部是对开的，像换片而不是滑动。
     翻过去的那张靠 `--sink` 下沉 26px、缩 4%、降到 45% 不透明度，退到后层当作纸张叠放的深度。
  3. *节奏* —— 每张先占满四成行程静止不动，剩下六成才用 `smoothstep(0.42, 1, …)`
     做加减速完成切换。没有这个停留期，画面会一直在动，反而显得廉价。
     舞台末尾另外留两成行程（`tail`）给最后一张停住，读完再交给下一章节。
  JS 每帧只给每张幻灯片写五个自定义属性（`--clip` / `--enter` / `--sink` / `--vis` /
  `--shift`），具体样式全部由 CSS 消费，`useFeaturedStage.js` 不碰任何具体样式值。
  滚动回调走 rAF 合并。
  **降级**：窄屏（≤860px）与 `prefers-reduced-motion` 下不写任何变量，
  `.featuredstage` 高度回到 `auto`、`sticky` 回到 `static`、`clip-path` 全部取消，
  退回成三张普通的纵向堆叠卡片，三个项目一次看完，右下角的进度与页码一并隐藏。
- **页码可以点**：`.featuredtick` 是 `role="tab"` 的按钮，点击按
  `stageTop - sticky + (index / (count - 1)) * travel` 反推出目标滚动位置再平滑滚过去，
  所以「滚动」与「点击」操作的是同一套状态，不会打架。当前是第几张同时通过
  `aria-live` 播报给读屏。

- **换片舞台是可复用的**（`useSwapStage.js`）：精选作品与作品索引用的是同一个 hook，
  只是传入不同的选择器。参数里 `tail` 是**末尾留白的行程占比**——最后一张揭完后
  原地停住一段，不会刚露脸就被推走（精选区 0.2、索引区 0.16）；`idle` 为真时
  整套变量立刻卸下退回静态排版。
  `useFeaturedStage.js` 现在只是它的一层薄封装。
- **整站是一屏一屏换过去的，不是一路往下拉**（`useScrollScene.js` + `.scene.held`）。
  首屏 `.cover` 自身 `position: sticky` 钉在站头之下，`<main>` 带着自己的纸面从下方
  整屏覆盖上来，首屏按被盖住的比例（`--covered`）退后 40px、缩 3%、降到 45% 不透明度；
  图纸、履历、手记、联系四章同理：`.sceneholder` 是 sticky 的，章节本身留出
  `min-height: 172svh` 的停留行程（实测每章 625–860px），读完才被下一章盖过去。
  一屏装不下的章节（比如作品索引）会自动**不**加 `held`，退回正常滚动，
  判断写在 hook 的 `fit()` 里，随 resize 复算。
  hook 每帧只写三个章节级变量（`--pass` / `--in` / `--out`）和每层的
  `--lag` / `--near`：`--lag` 让同一章里图先于文落定，`--near` 是该元素与视口中线的
  接近度，用来把正在读的那一条转成正墨、其余退成灰。窄屏与减弱动效下全部卸下。
- **双语的取值方式**：所有可翻译内容都写成 `{ zh: '…', en: '…' }`，组件里统一用
  `const { t } = useLang()` 取值，`t()` 遇到双语对象取当前语言、遇到普通值原样返回，
  所以数字、邮箱、`m²` 这类不需要翻译的字段直接写字面量即可。少数带变量的句子
  （项目计数、排序播报、邮件标题、toast）在 `ui.js` 里存成**函数**，用法是
  `t(ui.index.countLine)(12, 9)` —— 先 `t()` 取到函数再调用。数组同理：
  `t(project.team)` 拿到当前语言的数组，中文用 `、` 连接、英文用 `, ` 连接。
- **英文排版的定向覆盖**：切换语言会把 `data-lang` 写到 `<html>` 上，
  英文专属的排版调整全部集中在 `sections.css` 末尾的 `html[data-lang="en"] { … }`
  一段里，中文规则完全不受影响。已经处理的几处：拉丁文行高收到 1.55、
  标题字距收紧到 `-.038em`、索引表把「Type」列从 76px 放宽到 104px、
  联系方式的固定标签列从 96px 放宽到 124px、名称按词切分后补 `column-gap: .26em`。
  英文文案更长，站头有两个英文专属断点：≤1240px 隐藏 logo 副标题、≤1080px
  提前进入紧凑头（隐藏导航与邮箱，等同中文 ≤860px 的行为）。
  加新语言或新字段时，先在三档宽度下量一遍有没有溢出，再决定要不要加覆盖。

**样式纪律**（改动时请沿用）：底色 `#fcfcfc`、墨 `#111110`，层级一律用 alpha 不再
调第二个灰；强调色只有 `--accent` 一个，只出现在少数几处（站头当前项下划线、排序
列头下划线、悬停行首的方点、邮箱下划线）；**全站没有任何圆角**——
`--radius` 恒为 0，按钮、输入框、标签、图片一律直角，新增元素也不要再引入圆角；
全站不用阴影，只有悬停预览缩略图有一层极浅的投影；
过渡只有 `--fast` 与 `--slow` 两档。类名用名词（`.projectrow` / `.drawingstrip` /
`.sectionlead`），状态写成复合选择器（`.projectrow.active`、`.colhead.sorted`）。

## 本地运行

```bash
npm install
npm run dev      # 或 ./serve.sh
npm run build    # 产物在 dist/，可直接静态托管
```
