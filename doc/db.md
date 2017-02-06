## 最初设计:

```
[记账凭证表](核心表) vouchers
vou_id|vou_no|month|timestamp|entered|cashier|appoved|prepared|associated
ID | 凭证号 | 月份    | 时间戳 | 会计 | 出纳 | 审核 | 操作人(制单) | 关联
3  | 1     | 201612 |  $    | --   | 小张 | --  | 系统自动     | 销售单 1013

[分录表](扩展表) journal_entries
je_id|desc|title_id |inner_unit|related_unit|loan|entries|vou_id
ID | 摘要 | 科目  | 核算单位  | 单位往来     | 借贷 | 额度 | 凭证 ID
1 | 收款 | 库存现金| 恒信店   | 客户         | 1   | 100 | 3
2 | 收款 | 销售收入| 恒信店   | 客户         | 2   | 100 | 3

[科目表](解释表) titles
id      | name    | pid  | level | account
科目编号 | 科目名称 | 父科目 | 状态 | 账户
------ | -------- | ---- | ---- | ---
1      | 资产      | 0   | 1     | 0
2      | 负债      | 0   | 1     | 0
3      | 所有者权益 | 0   | 1     | 0
6      | 损益      | 0  | 1     | 0
1001   | 库存现金  | 1    | 1    | 1
1001   | 银行存款  | 1    | 5    | 1
1602   | 累计折旧  | 1    | 1    | 1
6001   |主营业务收入| 6    | 1    | 2
```

## 表结构:

```
CREATE TABLE titles (
    id integer PRIMARY KEY, /* 科目 title_id */
    name varchar(12) NOT NULL UNIQUE, /* 科目名称 */
    pid integer NOT NULL, /* 父科目 ID */
    level smallint NOT NULL, /* 级别, 1 为系统级别, 5 为用户自建 */
    account smallint NOT NULL /* 0 为不可直接作为账户, 1 为借增贷减, 2 为借减贷增 */
);

CREATE TABLE vouchers (
    id SERIAL PRIMARY KEY, /* 记账凭证 vou_id */
    month varchar(6) NOT NULL, /* 凭证月份 */
    vou_no smallint NOT NULL, /* 凭证月序号 */
    entered text, /* 会计员 */
    cashier text, /* 出纳员 */
    appoved text, /* 核准人 */
    prepared text NOT NULL, /* 制单人 */
    associated jsonb NOT NULL, /* 相关信息 */
    timestamp text NOT NULL,
    UNIQUE (month, vou_no)
);
CREATE INDEX vouchers_id_index ON vouchers (id);

CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY, /* 凭证分录 je_id */
    description varchar(20) NOT NULL, /* 摘要 */
    title_id integer NOT NULL, /* 相关科目 ID */
    inner_unit text, /* 核算单位 */
    related_unit text, /* 往来单位 */
    loan smallint NOT NULL, /* 借贷, 1 为借记, 2 为贷记 */
    entries money NOT NULL, /* 额度 */
    vou_id integer NOT NULL /* 相关凭证 ID */
);
CREATE INDEX journal_entries_vou_id_index ON journal_entries (vou_id);
```

### 表结构造成的限制:

科目 ID 不得大于 `2147483647`.

---

## 部门 department

```
CREATE TABLE departments (
    id SERIAL PRIMARY KEY, /* 部门 dep_id */
    name text NOT NULL UNIQUE, /* 部门名称 */
    num varchar(9) NOT NULL UNIQUE, /* 编号 */
    pinyin_num varchar(20) UNIQUE, /* 拼音编号 */
    pid integer NOT NULL, /* 父部门 ID */
    orders smallint, /* 权重 */
    timestamp text
);
```

备注: `pid` 为 `0` 时为顶级部门.

## 邀请 invite

```
CREATE TABLE invite (
    id SERIAL PRIMARY KEY, /* 邀请 inv_id */
    invitee text NOT NULL UNIQUE, /* 受邀者 */
    inviter text NOT NULL, /* 邀请者 */
    add_time timestamp DEFAULT CURRENT_TIMESTAMP
);
```
