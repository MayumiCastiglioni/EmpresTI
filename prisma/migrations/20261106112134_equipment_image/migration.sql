-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "image" JSONB;

ALTER TABLE "equipment" ADD CONSTRAINT "equipment_image_object_check"
CHECK ("image" IS NULL OR jsonb_typeof("image") = 'object');
