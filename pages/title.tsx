import { Label } from "@/components/ui/label"

const Title: React.FC = () => {
    return(
        <div className="fixed top-0 left-0 m-4">
        <div>
            <Label style={{ fontSize: '30px' }}>Key Chan</Label>
          </div>
          <div>
          <Label style={{ fontSize: '20px' }}>-鍵の貸し借り管理補助アプリ-</Label>
          </div>
          </div>
    );
}
export default Title;