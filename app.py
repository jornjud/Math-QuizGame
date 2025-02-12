import streamlit as st
import random

# Set up the basic structure of the Streamlit app
st.title("เกมควิซ")
st.write("กรุณาใส่ชื่อผู้เล่นและเลือกโหมดการเล่น")

# Player name input
player_name = st.text_input("ชื่อผู้เล่น:")

# Mode selection
mode = st.selectbox("เลือกโหมดการเล่น", ["ปกติ", "จับเวลา"])

# Timer settings for timed mode
timer_value = 0
if mode == "จับเวลา":
    timer_value = st.slider("ตั้งเวลา (วินาที):", min_value=10, max_value=60, step=10, value=10)

# Start game button
if st.button("เริ่มเกม"):
    st.session_state['player_name'] = player_name
    st.session_state['mode'] = mode
    st.session_state['timer_value'] = timer_value
    st.session_state['score'] = 0
    st.session_state['question_count'] = 0
    st.session_state['game_started'] = True

# Quiz section
if 'game_started' in st.session_state and st.session_state['game_started']:
    if st.session_state['question_count'] < 10:
        num1 = random.randint(2, 12)
        num2 = random.randint(2, 12)
        question = f"{num1} x {num2} = ?"
        correct_answer = num1 * num2

        st.write(f"คำถามที่ {st.session_state['question_count'] + 1}: {question}")
        answer = st.text_input("คำตอบของคุณ:")

        if st.button("ส่งคำตอบ"):
            if int(answer) == correct_answer:
                st.session_state['score'] += 1
            st.session_state['question_count'] += 1
            st.experimental_rerun()
    else:
        st.write(f"โหมดที่เล่น: {st.session_state['mode']}")
        st.write(f"คะแนนที่ได้: {st.session_state['score']} (ผู้เล่น: {st.session_state['player_name']})")
        st.session_state['game_started'] = False

# Virtual numeric keypad
if 'game_started' in st.session_state and st.session_state['game_started']:
    st.write("กดปุ่มตัวเลขเพื่อใส่คำตอบ:")
    cols = st.columns(3)
    for i in range(1, 10):
        if i % 3 == 1:
            cols = st.columns(3)
        cols[i % 3].button(str(i), key=f"num_{i}")
    cols = st.columns(3)
    cols[0].button("0", key="num_0")
    cols[1].button("C", key="clear")

# Return to main menu button in normal mode
if 'game_started' in st.session_state and st.session_state['game_started'] and st.session_state['mode'] == "ปกติ":
    if st.button("กลับไปที่เมนูหลัก"):
        st.session_state['game_started'] = False
        st.experimental_rerun()
