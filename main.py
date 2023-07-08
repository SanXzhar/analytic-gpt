import os
import pandas as pd
import streamlit as st
import plotly.express as px
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain import PromptTemplate
from langchain.llms import OpenAI

def main():
    load_dotenv()
    st.set_page_config("Analytic-gpt")
    st.header("Analytic-gpt")
    st.subheader("Upload your excel data")
    openai_key = os.getenv("OPENAI_API_KEY")

    raw_table = st.file_uploader(label="upload")




    model = OpenAI(
        model_name="gpt-3.5-turbo-16k",
        openai_api_key=openai_key,
    )

    if raw_table is not None:

        table = pd.read_excel(raw_table)

        template = """/
        You are senior data analytic. Analyse following excel file and mention main matrix and trends. Excel file: {table}
        """

        prompt = PromptTemplate.from_template(template)
        st.write(model(prompt.format(table = table)))


# template = """/
# You are a naming consultant for new companies.
# What is a good name for a company that makes {product}?
# """

# prompt = PromptTemplate.from_template(template)
# prompt.format(product="colorful socks")
    

    



# def main():
#     load_dotenv()
#     st.set_page_config(page_title="@armansu")
#     st.header("Ask your question from @Armansu")
#     os.getenv("OPENAI_API_KEY")
    
#     embeddings = OpenAIEmbeddings()

#     knowledge_base = FAISS.load_local("./storage/index3", embeddings)
#     user_question = st.text_input("Type your question")
#     if user_question:
#         chain = RetrievalQA.from_chain_type(llm = ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff", retriever = knowledge_base.as_retriever())
#         response = chain.run(user_question)
#         st.write(response)

if __name__ == "__main__":
    main()