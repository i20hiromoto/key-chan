import axios from 'axios';

interface DataItem {
  id : number,
  name : string,
  status : boolean,
  student : string
  // 他のプロパティがあればここに追加
}


const fetchData = async (): Promise<DataItem[]> => {
  try {
    const response = await axios.get<DataItem[]>('http://localhost:3001/api/get/dontborrowed');
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
    return [];
  }
};

export default fetchData;
