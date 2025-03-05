// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button, Typography, Checkbox, Card, Col, Row, Divider, Radio } from "antd";

export interface courseData {
  course_code: string;
  title: string;
  description: string;
}

export default function Home() {
  const [results, setResults] = useState<courseData[]>([]);
  const [inputList, setInputList] = useState<string[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [remList, setRemList] = useState<string[]>([]); 
  const [shouldRem, setShouldRem] = useState(false);

  const [justCAS, setJustCAS] = useState(false);
  const [numFilter, setNumFilter] = useState(1000);

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
    console.log(numFilter)
    getCourses();
    setShouldFetch(false);
    setShouldRem(false);
  }, [shouldFetch, shouldRem, justCAS, numFilter]);


  const onCheck = (checkedValues: any) => {
    setInputList(checkedValues)
  }

  const deselectAll = () => {
    setInputList([]);
  };

  const getCourses = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/courses", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({input_list: inputList, rem_list: remList, cas_filter: justCAS, num_filter: numFilter})
      });

      const data = await response.json()
      
      if (response.ok) {
        setResults(data.result)
      } else{
        console.error("Error:", data.error)
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  }

  return (
    <div>
      <Typography.Title>B(U)eat The System</Typography.Title>
      <Typography.Paragraph>On this page you can select as many checkboxes as you would like and after clicking the submit button you will provided with a list of courses that fulfill those hub units. If you want to remove a course from the outputted set you can click on the checkbox in the upper right corner of the course card and then click the resubmit button and that course will be replaced. You can also filter to just CAS courses or courses of a certain level!!!</Typography.Paragraph>
      <div style={{padding: "10px"}}>
        <Checkbox.Group options={my_hubs} onChange={onCheck} value={inputList}></Checkbox.Group>
      </div>
      <div style={{marginBottom: "20px"}}>
        <Button onClick={() => setShouldFetch(true)} style={{margin: "2px"}}>Submit</Button>
        <Button onClick={() => setInputList(my_hubs)} style={{margin: "2px"}}>Select All</Button>
        <Button onClick={deselectAll} style={{margin: "2px"}}>Deselect All</Button>
      </div>
      
      <Typography.Title level={2}>Courses You Should Take: </Typography.Title>
      <div style={{margin:"10px"}}>
        <Checkbox onChange={(e) => setJustCAS(e.target.checked)}>Filter to Just CAS Courses</Checkbox>
        <Radio.Group onChange={(e) => setNumFilter(e.target.value)} value={numFilter}>
          <Radio value={299}>200 level or less</Radio>
          <Radio value={399}>300 level or less</Radio>
          <Radio value={1000}>All Course Levels</Radio>
        </Radio.Group>
      </div>
      <Button onClick={() => setShouldRem(true)} style={{marginBottom: "10px" }}>Resubmit</Button>
      <Row
        style={{marginLeft: "-4px", marginRight: "-4px", rowGap: "8px"}}
      >
        {results.map((course) => (
          <Col
            xs={{span:24}}
            sm={{span:12}}
            md={{span:8}}
            style={{paddingRight: "4px", paddingLeft: "4px"}}
            key={course.course_code}
          >
            <Card
               title={course.course_code}
               extra={
               <Checkbox onChange={(e) => {
                  if (e.target.checked) {
                    setRemList([course.course_code, ...remList])
                  } else {
                    var newList : string[] = [];
                    remList.map((item) => {
                      if (item !== course.course_code) {
                        newList.push(item)
                      }
                    })
                    setRemList(newList)
                  }
               }}
               >
               </Checkbox>}
               style={{borderRadius: "8px", border: "1px solid #f0f0f0", overflow: "hidden"}}
            >
              <Typography.Title level={5} style={{textDecoration : 'underline'}}>
                {course.title}
              </Typography.Title>
              <Divider></Divider>
              <Typography.Paragraph>
                {course.description}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}