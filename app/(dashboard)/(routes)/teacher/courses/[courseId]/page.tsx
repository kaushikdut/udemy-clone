import { db } from "@/lib/db";
import TitleForm from "./_component/title-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DescriptionForm from "./_component/description-form";
import ImageForm from "./_component/image-form";
import CategoryForm from "./_component/category-form";
import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSignIcon,
  File,
  FileIcon,
  LayoutDashboard,
  ListChecksIcon,
} from "lucide-react";
import PriceForm from "./_component/price-form";
import AttachmentForm from "./_component/attachment-form";
import ChapterForm from "./_component/chapters-form";

const courseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/teacher/courses");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      attachments: { orderBy: { createdAt: "desc" } },
      chapters: { orderBy: { position: "asc" } },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Course Setup</h1>
      <div className="grid mt-10 gap-2 gap-x-6 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-y-8 p-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h1 className="text-2xl font-bold">Customize your course</h1>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm
            initialData={{
              ...course,
              description: course.description || undefined,
            }}
            courseId={course.id}
          />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div>
          <div className="flex flex-col gap-y-8 p-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecksIcon} />
              <h1 className="text-xl font-bold">Course Chapter</h1>
            </div>
            <div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSignIcon} />{" "}
                <h2 className="text-xl font-semibold">Sell your Course</h2>
              </div>
              <PriceForm courseId={course.id} initialData={course} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FileIcon} />

                <h1 className="text-xl font-semibold">
                  Resources & Attachments
                </h1>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default courseIdPage;
