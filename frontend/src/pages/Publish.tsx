import AppBar from "../component/AppBar";
import PublishForm from "../component/PublishForm";

function PublishPage() {
  return (
    <>
      <div className="grid grid-cols-4">
        <div className="col-span-4">
          <AppBar />
        </div>
        <div className="col-span-4">
          <PublishForm />
        </div>
      </div>
    </>
  );
}

export default PublishPage;
