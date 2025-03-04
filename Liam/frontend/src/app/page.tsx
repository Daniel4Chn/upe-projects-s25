// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button, Typography, Checkbox } from "antd";

export default function Home() {
  const [results, setResults] = useState([]);
  const [inputList, setInputList] = useState<String[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const my_hubs = [
    "Critical Thinking", 
    "Critical Thinking 2",
    "Research and Information Literacy", 
    "Research and Information Literacy 2",
    "Teamwork/Collaboration", 
    "Teamwork/Collaboration 2",
    "Creativity/Innovation", 
    "Creativity/Innovation 2",
    "First-Year Writing Seminar", 
    "Writing, Research, and Inquiry",
    "Writing-Intensive Course", 
    "Writing-Intensive Course 2",
    "Oral and/or Signed Communication", 
    "Digital/Multimedia Expression", 
    "The Individual in Community", 
    "Global Citizenship and Intercultural Literacy", 
    "Global Citizenship and Intercultural Literacy 2",
    "Ethical Reasoning", 
    "Quantitative Reasoning I", 
    "Quantitative Reasoning II", 
    "Scientific Inquiry I", 
    "Scientific Inquiry II", 
    "Social Inquiry",
    "Philosophical Inquiry and Life's Meanings", 
    "Aesthetic Exploration", 
    "Historical Consciousness"
  ]

  useEffect(() => {
    fetchCourses();
    setShouldFetch(false);
  }, [shouldFetch]);

  const onCheck = (checkedValues: any) => {
    setInputList(checkedValues)
  }

  const deselectAll = () => {
    setInputList([]);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/courseFind", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({input_list : inputList})
      });

      const data = await response.json()

      if (response.ok) {
        setResults(data.result)
        console.log(data.result)
      } else {
        console.error("Error:", data.error)
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <div>
      <Typography.Title>B(U)eat The System</Typography.Title>
      <Typography.Paragraph>On this page you can select as many checkboxes as you would like and after clicking the submit button you will provided with a list of courses that fulfill those hub units!!!</Typography.Paragraph>
      <div style={{padding: "10px"}}>
        <Checkbox.Group options={my_hubs} onChange={onCheck} value={inputList}></Checkbox.Group>
      </div>
      <div style={{marginBottom: "20px"}}>
        <Button onClick={() => setShouldFetch(true)} style={{margin: "2px"}}>Submit</Button>
        <Button onClick={() => setInputList(my_hubs)} style={{margin: "2px"}}>Select All</Button>
        <Button onClick={deselectAll} style={{margin: "2px"}}>Deselect All</Button>
      </div>
      
      <Typography.Title level={2}>Courses You Should Take: </Typography.Title>
      <ul>
        {results.map((item, index) => (
          <li key={index}><Typography.Title level={4}>{item}</Typography.Title></li>
        ))}
      </ul>
      {/*<Button type="primary">{results ? results : "Loading..."}</Button>*/}
    </div>
  );
}