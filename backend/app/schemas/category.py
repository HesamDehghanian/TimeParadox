from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    priority: int = Field(
        default=1,
        ge=1,
        le=5,
    )

    color: str = Field(
        default="#3B82F6",
        max_length=20,
    )

    icon: str | None = Field(
        default=None,
        max_length=50,
    )

    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    priority: int | None = Field(
        default=None,
        ge=1,
        le=5,
    )

    color: str | None = Field(
        default=None,
        max_length=20,
    )

    icon: str | None = Field(
        default=None,
        max_length=50,
    )

    is_active: bool | None = None


class CategoryResponse(CategoryBase):

    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )