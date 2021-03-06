-- 为方便在编辑器中直接执行语句看结果, 将可能用到的调试语句列出.

-- 表结构
CREATE TABLE invite (
    id SERIAL PRIMARY KEY, /* 邀请 inv_id */
    invitee text NOT NULL UNIQUE, /* 受邀者 */
    inviter text NOT NULL, /* 邀请者 */
    type integer DEFAULT 1, /* 邀请类型 */
    add_time bigint DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::bigint,
    UNIQUE (invitee, type)
);

-- ⬇️ 暂未使用
CREATE TABLE invite_cache (
    inviter text PRIMARY KEY, /* 邀请者 */
    count int NOT NULL, /* 数量 */
    state smallint /* 状态 */
);

-- 索引: 暂无

-- 删除表
DROP TABLE invite;

-- 清空表
TRUNCATE invite;

-- 添加测试数据
INSERT INTO invite (invitee, inviter) VALUES
('张三', '恒信店'),
('李四', '恒信店'),
('王五', '九店');

-- 查看测试数据
SELECT id, add_time
FROM invite;

-- 调试: 查看邀请统计
SELECT inviter, COUNT(id) AS count_num
FROM invite
WHERE add_time > 999 AND add_time < 1486374596563
GROUP BY inviter;

-- 调试: 新增邀请
INSERT INTO invite (invitee, inviter)
VALUES ($1, $2);