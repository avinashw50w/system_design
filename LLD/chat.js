1. Users
- id
- name
- phone

2. Chats
- id
- type            enum(group, one-to-one)
- created_at

3. Groups
- id
- name
- profile_pic
- admin_id
- created_at

4. ChatMembers
- chat_id
- user_id
- joined_at
- status

6. Messages
- id
- chat_id
- sender_id
- content
- image_url
- sent_at
- read_at
- status         enum(send, delivered, read)

7. MessageRecipients
- message_id
- recipient_id
- is_deleted

Users can delete their messages for themselves or for the entire chat by updating the is_deleted 
column in the MessageRecipients table.

Q1. SQL query to get list of one-to-one chat users
SELECT DISTINCT u.username
FROM Users u
JOIN ChatMembers p ON u.user_id = p.user_id
JOIN Chats c ON p.conversation_id = c.conversation_id
WHERE c.is_group = FALSE
AND p.user_id != :currentUserId;
----------------------------------------------------------------
1. Users
- id
- name
- phone

2. UserChats
- user1_id
- user2_id
- chat_id
- created_at

3. Chats
- id
- message_id

4. Messages
- id
- sender_id
- content
- sent_at
- read_at

5. Groups
- id
- name
- profile_pic
- admin_id
- created_at

6. GroupMembers
- group_id
- user_id
- joined_at
- status

7. GroupChats
- group_id
- message_id